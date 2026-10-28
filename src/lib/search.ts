import { destinations, experiences, packages, stays } from "./data";
import type { ItemKind } from "./types";

/** Lowercase, strip accents and punctuation: "Cancún" → "cancun", "Hội An" → "hoi an". */
export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Optimal string alignment distance (Levenshtein + adjacent transpositions). */
function editDistance(a: string, b: string) {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

const allowedTypos = (len: number) => (len <= 3 ? 0 : len <= 6 ? 1 : 2);

/** 0 = no match. Higher is better. Tolerates accents, case and small typos. */
export function matchScore(query: string, term: string) {
  const q = normalize(query);
  const t = normalize(term);
  if (!q || !t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 90 - Math.min(20, t.length - q.length);
  const words = t.split(" ");
  if (words.some((w) => w.startsWith(q))) return 75;
  if (t.includes(q)) return 60;
  // Typo tolerance against the whole term and each word, comparing equal-length prefixes
  // so "lisb" still finds "Lisbon" and "kyto" finds "Kyoto".
  const budget = allowedTypos(q.length);
  if (!budget) return 0;
  let best = Infinity;
  for (const cand of [t, ...words]) {
    best = Math.min(best, editDistance(q, cand.slice(0, q.length)), editDistance(q, cand));
  }
  return best <= budget ? 50 - best * 10 : 0;
}

export interface IndexEntry {
  kind: ItemKind;
  id: string;
  label: string;
  sub: string;
  terms: string[];
  destinationId: string;
}

type Lookup = (path: string) => string;

/** Build a localized search index. `t` reads from `content.*` in the active locale. */
export function buildIndex(t: Lookup): IndexEntry[] {
  return [
    ...destinations.map((d) => ({
      kind: "destination" as const,
      id: d.id,
      label: t(`destinations.${d.id}.name`),
      sub: t(`destinations.${d.id}.country`),
      terms: [t(`destinations.${d.id}.name`), t(`destinations.${d.id}.country`), ...d.aliases],
      destinationId: d.id,
    })),
    ...stays.map((s) => ({
      kind: "stay" as const,
      id: s.id,
      label: t(`stays.${s.id}.name`),
      sub: t(`stays.${s.id}.area`),
      terms: [t(`stays.${s.id}.name`), t(`stays.${s.id}.area`)],
      destinationId: s.destinationId,
    })),
    ...experiences.map((e) => ({
      kind: "experience" as const,
      id: e.id,
      label: t(`experiences.${e.id}.title`),
      sub: t(`experiences.${e.id}.area`),
      terms: [t(`experiences.${e.id}.title`), t(`experiences.${e.id}.area`)],
      destinationId: e.destinationId,
    })),
    ...packages.map((p) => ({
      kind: "package" as const,
      id: p.id,
      label: t(`packages.${p.id}.title`),
      sub: `${p.fromCode} → ${p.toCode}`,
      terms: [t(`packages.${p.id}.title`), t(`packages.${p.id}.toCity`), p.toCode],
      destinationId: p.destinationId,
    })),
  ];
}

export function searchIndex(index: IndexEntry[], query: string, limit = 7) {
  return index
    .map((entry) => ({
      entry,
      // Destinations first on ties: they're what most people type.
      score: Math.max(...entry.terms.map((term) => matchScore(query, term))) + (entry.kind === "destination" ? 5 : 0),
    }))
    .filter((r) => r.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}

/** Destination ids a free-text query refers to (used by the results page). */
export function destinationsForQuery(index: IndexEntry[], query: string) {
  if (!query.trim()) return null;
  const hits = new Set<string>();
  for (const entry of index) {
    if (entry.terms.some((term) => matchScore(query, term) >= 50)) hits.add(entry.destinationId);
  }
  return hits;
}

export const POPULAR_DESTINATIONS = ["lisbon", "kyoto", "oaxaca", "cancun", "marrakech"];
