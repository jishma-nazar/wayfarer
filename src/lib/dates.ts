export type DatePreset = "flexible" | "weekend" | "nextMonth" | "custom";

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function todayISO() {
  return iso(new Date());
}

/** Resolve a preset to concrete dates (client-side only — depends on "now"). */
export function presetRange(preset: DatePreset, now = new Date()): { checkIn?: string; checkOut?: string } {
  if (preset === "weekend") {
    const day = now.getDay(); // 0 Sun … 6 Sat
    const friday = new Date(now);
    if (day === 0) friday.setDate(now.getDate() - 2);
    else if (day === 6) friday.setDate(now.getDate() - 1);
    else friday.setDate(now.getDate() + (5 - day));
    const start = friday < now ? now : friday;
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    return { checkIn: iso(start), checkOut: iso(sunday) };
  }
  if (preset === "nextMonth") {
    const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return { checkIn: iso(start), checkOut: iso(end) };
  }
  return {};
}

export function parseISODate(value?: string) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}
