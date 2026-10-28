"use client";

import { ArrowRight, Check, Plane, SlidersHorizontal, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { destinations, experiences, packages, stays } from "@/lib/data";
import { buildIndex, destinationsForQuery, matchScore, POPULAR_DESTINATIONS } from "@/lib/search";
import { MOODS, type ItemKind, type Mood, type SearchTab } from "@/lib/types";
import type { DatePreset } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { SearchModule } from "@/components/search/SearchModule";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { StayCard } from "@/components/cards/StayCard";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { BoardingPassCard } from "@/components/cards/BoardingPassCard";
import { Sheet } from "@/components/ui/Sheet";

type Row = {
  kind: ItemKind;
  id: string;
  destinationId: string;
  name: string;
  price: number;
  rating?: number;
  reviews?: number;
  freeCancellation?: boolean;
  moods?: Mood[];
};

const PRICE_BUCKETS = { under: [0, 150], mid: [150, 300], over: [300, Infinity] } as const;
type PriceKey = keyof typeof PRICE_BUCKETS;
type SortKey = "recommended" | "priceAsc" | "priceDesc" | "rating";
const KIND_ORDER: ItemKind[] = ["destination", "stay", "experience", "package"];
const TAB_TO_KIND: Partial<Record<SearchTab, ItemKind>> = { stays: "stay", experiences: "experience", packages: "package" };

interface Filters {
  kind?: ItemKind;
  price?: PriceKey;
  rating: boolean;
  cancel: boolean;
  mood?: Mood;
}

function applyFilters(rows: Row[], f: Filters) {
  return rows.filter((r) => {
    if (f.kind && r.kind !== f.kind) return false;
    if (f.price) {
      const [lo, hi] = PRICE_BUCKETS[f.price];
      if (r.price < lo || r.price >= hi) return false;
    }
    if (f.rating && !(r.rating && r.rating >= 4.5)) return false;
    if (f.cancel && !r.freeCancellation) return false;
    if (f.mood && !r.moods?.includes(f.mood)) return false;
    return true;
  });
}

/**
 * Results with visible, individually removable filters and live counts.
 * All state lives in the URL, so it survives reloads, sharing and language switches.
 * `fixedKind` turns this into a category page (Stays, Experiences…).
 */
export function Results({ fixedKind }: { fixedKind?: ItemKind }) {
  const t = useTranslations("results");
  const tm = useTranslations("moods");
  const tc = useTranslations("content");
  const tcard = useTranslations("card");
  const locale = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);

  const q = params.get("q") ?? "";
  const tab = (params.get("type") as SearchTab | null) ?? "all";
  const filters: Filters = {
    kind: fixedKind ?? (params.get("kind") as ItemKind | null) ?? TAB_TO_KIND[tab],
    price: (params.get("price") as PriceKey | null) ?? undefined,
    rating: params.get("rating") === "1",
    cancel: params.get("cancel") === "1",
    mood: (params.get("mood") as Mood | null) ?? undefined,
  };
  const sort = (params.get("sort") as SortKey | null) ?? "recommended";

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "kind" && next.get("type")) next.delete("type");
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  const clearAll = () => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- depends on locale only
  const index = useMemo(() => buildIndex((k) => tc(k)), [locale]);

  const rows = useMemo<Row[]>(
    () => [
      ...destinations.map((d) => ({ kind: "destination" as const, id: d.id, destinationId: d.id, name: tc(`destinations.${d.id}.name`), price: d.fromPrice })),
      ...stays.map((s) => ({ kind: "stay" as const, id: s.id, destinationId: s.destinationId, name: tc(`stays.${s.id}.name`), price: s.pricePerNight, rating: s.rating, reviews: s.reviews, freeCancellation: s.freeCancellation })),
      ...experiences.map((e) => ({ kind: "experience" as const, id: e.id, destinationId: e.destinationId, name: tc(`experiences.${e.id}.title`), price: e.price, rating: e.rating, reviews: e.reviews, freeCancellation: e.freeCancellation, moods: e.moods })),
      ...packages.map((p) => ({ kind: "package" as const, id: p.id, destinationId: p.destinationId, name: tc(`packages.${p.id}.title`), price: p.price, rating: p.rating, reviews: p.reviews })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  const matched = useMemo(() => {
    const dests = destinationsForQuery(index, q);
    if (!dests) return rows;
    return rows.filter((r) => dests.has(r.destinationId) || matchScore(q, r.name) >= 50);
  }, [rows, index, q]);

  const results = useMemo(() => {
    const list = applyFilters(matched, filters);
    const by = {
      recommended: (a: Row, b: Row) => (b.rating ?? 0) * Math.log10((b.reviews ?? 1) + 10) - (a.rating ?? 0) * Math.log10((a.reviews ?? 1) + 10),
      priceAsc: (a: Row, b: Row) => a.price - b.price,
      priceDesc: (a: Row, b: Row) => b.price - a.price,
      rating: (a: Row, b: Row) => (b.rating ?? 0) - (a.rating ?? 0),
    }[sort];
    return sort === "recommended" ? list : [...list].sort(by);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, filters.kind, filters.price, filters.rating, filters.cancel, filters.mood, sort]);

  const countWith = (patch: Partial<Filters>) => applyFilters(matched, { ...filters, ...patch }).length;

  // Active filter chips (each removable on its own).
  const active: { key: string; label: string }[] = [];
  if (!fixedKind && filters.kind && params.get("kind")) active.push({ key: "kind", label: t(`kinds.${filters.kind}`) });
  if (filters.price) active.push({ key: "price", label: t(filters.price === "under" ? "priceUnder" : filters.price === "mid" ? "priceMid" : "priceOver") });
  if (filters.rating) active.push({ key: "rating", label: t("ratingMin") });
  if (filters.cancel) active.push({ key: "cancel", label: tcard("freeCancellation") });
  if (filters.mood) active.push({ key: "mood", label: tm(filters.mood) });

  const showMood = !filters.kind || filters.kind === "experience";
  const isFlights = tab === "flights" && !fixedKind;

  const filterPanel = (
    <div className="space-y-8">
      {!fixedKind && (
        <FilterGroup title={t("type")}>
          {KIND_ORDER.map((k) => (
            <FilterOption key={k} checked={filters.kind === k} count={countWith({ kind: k })} onChange={(on) => setParam("kind", on ? k : undefined)} label={t(`kinds.${k}`)} type="radio" name="kind" />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title={t("price")}>
        {(Object.keys(PRICE_BUCKETS) as PriceKey[]).map((p) => (
          <FilterOption key={p} checked={filters.price === p} count={countWith({ price: p })} onChange={(on) => setParam("price", on ? p : undefined)} label={t(p === "under" ? "priceUnder" : p === "mid" ? "priceMid" : "priceOver")} type="radio" name="price" />
        ))}
      </FilterGroup>
      <FilterGroup title={t("rating")}>
        <FilterOption checked={filters.rating} count={countWith({ rating: true })} onChange={(on) => setParam("rating", on ? "1" : undefined)} label={t("ratingMin")} />
      </FilterGroup>
      <FilterGroup title={t("cancellation")}>
        <FilterOption checked={filters.cancel} count={countWith({ cancel: true })} onChange={(on) => setParam("cancel", on ? "1" : undefined)} label={tcard("freeCancellation")} />
      </FilterGroup>
      {showMood && (
        <FilterGroup title={t("mood")}>
          {MOODS.map((mo) => (
            <FilterOption key={mo} checked={filters.mood === mo} count={countWith({ mood: mo })} onChange={(on) => setParam("mood", on ? mo : undefined)} label={tm(mo)} type="radio" name="mood" />
          ))}
        </FilterGroup>
      )}
    </div>
  );

  const grouped = KIND_ORDER.map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) })).filter((g) => g.items.length);

  return (
    <div>
      <div className="border-b border-hairline bg-paper-2">
        <div className="container-x py-6 md:py-8">
          <SearchModule
            key={params.toString()}
            variant="page"
            initial={{
              tab,
              query: q,
              origin: params.get("from") ?? "",
              when: (params.get("when") as DatePreset | null) ?? "flexible",
              checkIn: params.get("in") ?? undefined,
              checkOut: params.get("out") ?? undefined,
              adults: Number(params.get("adults") ?? 2),
              children: Number(params.get("children") ?? 0),
            }}
          />
        </div>
      </div>

      <div className="container-x py-10 lg:py-14">
        {isFlights && <FlightsPanel q={q} from={params.get("from") ?? ""} />}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="t-h2" aria-live="polite">
            {t("count", { count: results.length })}
            {q && <span className="text-ink-muted"> {t("for", { query: q })}</span>}
          </h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheetOpen(true)} className="btn btn-ghost lg:hidden">
              <SlidersHorizontal size={16} strokeWidth={1.5} aria-hidden />
              {active.length ? t("showFiltersCount", { count: active.length }) : t("showFilters")}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-ink-muted sm:inline">{t("sort")}</span>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value === "recommended" ? undefined : e.target.value)} className="field min-h-11 w-auto py-2 pr-8 text-[0.9375rem]" aria-label={t("sort")}>
                {(["recommended", "priceAsc", "priceDesc", "rating"] as SortKey[]).map((s) => (
                  <option key={s} value={s}>{t(`sortOptions.${s}`)}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {active.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label={t("activeFilters")}>
            {active.map((a) => (
              <button key={a.key} type="button" onClick={() => setParam(a.key)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink bg-ink px-3.5 text-sm font-medium text-paper hover:bg-ink/85">
                {a.label}
                <X size={14} strokeWidth={1.5} aria-hidden />
                <span className="sr-only">{t("removeFilter", { label: a.label })}</span>
              </button>
            ))}
            <button type="button" onClick={clearAll} className="min-h-11 px-2 text-sm font-semibold link-underline">
              {t("clearAll")}
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <aside aria-label={t("filters")} className="hidden lg:block">
            <h2 className="eyebrow mb-6 text-ink-muted" style={{ fontFamily: "var(--type-ui)" }}>{t("filters")}</h2>
            {filterPanel}
          </aside>

          <div className="min-w-0">
            {results.length === 0 ? (
              <EmptyState q={q} hasFilters={active.length > 0} onClear={clearAll} />
            ) : (
              <div className="space-y-14">
                {grouped.map((g) => (
                  <section key={g.kind} aria-labelledby={`group-${g.kind}`}>
                    {grouped.length > 1 && (
                      <h3 id={`group-${g.kind}`} className="eyebrow mb-6 flex items-center gap-3 text-ink-muted">
                        {t(`kinds.${g.kind}`)} <span className="num font-mono">{g.items.length}</span>
                        <span aria-hidden className="h-px flex-1 bg-hairline" />
                      </h3>
                    )}
                    <ul role="list" className={cn("grid gap-x-6 gap-y-12", g.kind === "package" ? "grid-cols-1" : g.kind === "destination" ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-3")}>
                      {g.items.map((r) => (
                        <li key={r.id}>{renderRow(r)}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t("filters")} closeLabel={t("closeFilters")} className="lg:hidden">
        <div className="flex-1 px-4 py-6">{filterPanel}</div>
        <div className="sticky bottom-0 flex gap-3 border-t border-hairline bg-paper p-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
          {active.length > 0 && (
            <button type="button" onClick={clearAll} className="btn btn-ghost">{t("clearAll")}</button>
          )}
          <button type="button" onClick={() => setSheetOpen(false)} className="btn btn-primary flex-1">
            {t("applyFilters", { count: results.length })}
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function renderRow(r: Row) {
  switch (r.kind) {
    case "destination":
      return <DestinationCard d={destinations.find((d) => d.id === r.id)!} sizes="(min-width: 1280px) 18vw, (min-width: 640px) 28vw, 45vw" />;
    case "stay":
      return <StayCard s={stays.find((s) => s.id === r.id)!} />;
    case "experience":
      return <ExperienceCard e={experiences.find((e) => e.id === r.id)!} />;
    case "package":
      return <BoardingPassCard p={packages.find((p) => p.id === r.id)!} notch="var(--paper)" className="border border-hairline" />;
  }
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

/** Single-choice groups use round marks but stay checkboxes, since a second click clears them. */
function FilterOption({ label, count, checked, onChange, type = "checkbox" }: { label: string; count: number; checked: boolean; onChange: (on: boolean) => void; type?: "checkbox" | "radio"; name?: string }) {
  const disabled = count === 0 && !checked;
  return (
    <label className={cn("group flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]", disabled && "cursor-default text-ink-faint")}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
          type === "radio" ? "rounded-full" : "rounded-[3px]",
          checked ? "border-ink bg-ink text-paper" : "border-hairline-strong group-hover:border-ink"
        )}
      >
        {checked && <Check size={13} strokeWidth={2} />}
      </span>
      <span className="flex-1">{label}</span>
      <span className="num text-sm text-ink-muted">{count}</span>
    </label>
  );
}

function FlightsPanel({ q, from }: { q: string; from: string }) {
  const t = useTranslations("results");
  const enquiry = new URLSearchParams({ ...(q ? { destination: q } : {}), ...(from ? { from } : {}) }).toString();
  return (
    <div className="mb-12 grid gap-6 rounded-lg border border-hairline bg-surface p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
      <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent-strong">
        <Plane size={22} strokeWidth={1.5} aria-hidden />
      </span>
      <div>
        <h2 className="t-h3">{t("flightsTitle")}</h2>
        {(q || from) && <p className="mt-1 font-mono text-sm text-ink-muted">{t("flightsRoute", { origin: from || "—", destination: q || "—" })}</p>}
        <p className="mt-2 max-w-[60ch] text-ink-muted">{t("flightsBody")}</p>
      </div>
      <Link href={`/enquire?${enquiry}`} className="btn btn-primary">
        {t("flightsCta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
      </Link>
    </div>
  );
}

function EmptyState({ q, hasFilters, onClear }: { q: string; hasFilters: boolean; onClear: () => void }) {
  const t = useTranslations("results");
  const td = useTranslations("content.destinations");
  return (
    <div className="rounded-lg border border-dashed border-hairline-strong px-6 py-12 text-center sm:px-12">
      <h3 className="t-h2">{t("emptyTitle")}</h3>
      <p className="mx-auto mt-3 max-w-[48ch] text-ink-muted">{hasFilters || !q ? t("emptyBody") : t("emptyNoQuery", { query: q })}</p>
      {hasFilters && (
        <button type="button" onClick={onClear} className="btn btn-ink mt-6">
          {t("clearAll")}
        </button>
      )}
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {POPULAR_DESTINATIONS.map((id) => (
          <li key={id}>
            <Link href={`/search?q=${encodeURIComponent(td(`${id}.name`))}`} className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong px-4 text-sm font-medium hover:border-ink">
              {td(`${id}.name`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
