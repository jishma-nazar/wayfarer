"use client";

import { Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import { parseISODate, presetRange, todayISO, type DatePreset } from "@/lib/dates";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/cn";

export interface WhenValue {
  when: DatePreset;
  checkIn?: string;
  checkOut?: string;
}

const PRESETS: DatePreset[] = ["flexible", "weekend", "nextMonth", "custom"];

export function useWhenSummary() {
  const t = useTranslations("search");
  const locale = useLocale();
  return (v: WhenValue) => {
    if (v.when === "flexible") return t("flexibleDates");
    if (v.when !== "custom") return t(`presets.${v.when}`);
    const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
    const a = parseISODate(v.checkIn);
    const b = parseISODate(v.checkOut);
    if (a && b) return fmt.formatRange(a, b);
    if (a) return fmt.format(a);
    return t("presets.custom");
  };
}

/** Presets first (most people don't know exact dates), exact dates on request. */
export function WhenPanel({ value, onChange, errors, onBlurValidate }: { value: WhenValue; onChange: (v: WhenValue) => void; errors?: { checkIn?: string; checkOut?: string }; onBlurValidate?: () => void }) {
  const t = useTranslations("search");
  const id = useId();
  const mounted = useMounted();
  const today = mounted ? todayISO() : undefined;

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="field-label">{t("when")}</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("presetsLabel")}>
          {PRESETS.map((p) => {
            const active = value.when === p;
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ when: p, ...(p === "custom" ? { checkIn: value.checkIn, checkOut: value.checkOut } : presetRange(p)) })}
                className={cn(
                  "min-h-11 rounded-sm border px-3.5 text-sm font-medium transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-hairline-strong hover:border-ink"
                )}
              >
                {t(`presets.${p}`)}
              </button>
            );
          })}
        </div>
      </fieldset>
      {value.when === "custom" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-in`} className="field-label">{t("checkIn")}</label>
            <input
              id={`${id}-in`}
              type="date"
              min={today}
              value={value.checkIn ?? ""}
              onChange={(e) => onChange({ ...value, checkIn: e.target.value })}
              onBlur={onBlurValidate}
              aria-invalid={!!errors?.checkIn || undefined}
              aria-describedby={errors?.checkIn ? `${id}-in-err` : undefined}
              className="field num"
            />
            {errors?.checkIn && <p id={`${id}-in-err`} className="field-error">{errors.checkIn}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-out`} className="field-label">{t("checkOut")}</label>
            <input
              id={`${id}-out`}
              type="date"
              min={value.checkIn || today}
              value={value.checkOut ?? ""}
              onChange={(e) => onChange({ ...value, checkOut: e.target.value })}
              onBlur={onBlurValidate}
              aria-invalid={!!errors?.checkOut || undefined}
              aria-describedby={errors?.checkOut ? `${id}-out-err` : undefined}
              className="field num"
            />
            {errors?.checkOut && <p id={`${id}-out-err`} className="field-error">{errors.checkOut}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function validateDates(v: WhenValue, t: (k: string) => string) {
  if (v.when !== "custom") return {};
  const errors: { checkIn?: string; checkOut?: string } = {};
  const today = todayISO();
  if (v.checkIn && v.checkIn < today) errors.checkIn = t("errors.pastDate");
  if (v.checkIn && v.checkOut && v.checkOut <= v.checkIn) errors.checkOut = t("errors.checkoutBeforeCheckin");
  return errors;
}

function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const t = useTranslations("search");
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div id={id}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-ink-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-1" role="group" aria-labelledby={id}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid size-11 place-items-center rounded-full border border-hairline-strong hover:border-ink disabled:opacity-35 disabled:hover:border-hairline-strong"
        >
          <Minus size={16} strokeWidth={1.5} aria-hidden />
          <span className="sr-only">{t("decrease", { label })}</span>
        </button>
        <output aria-live="polite" className="num w-8 text-center text-lg font-semibold">{value}</output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid size-11 place-items-center rounded-full border border-hairline-strong hover:border-ink disabled:opacity-35 disabled:hover:border-hairline-strong"
        >
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          <span className="sr-only">{t("increase", { label })}</span>
        </button>
      </div>
    </div>
  );
}

export function GuestsPanel({ adults, childCount, onChange }: { adults: number; childCount: number; onChange: (v: { adults: number; children: number }) => void }) {
  const t = useTranslations("search");
  return (
    <fieldset className="divide-y divide-hairline">
      <legend className="field-label">{t("who")}</legend>
      <Stepper label={t("adults")} hint={t("adultsHint")} value={adults} min={1} max={12} onChange={(n) => onChange({ adults: n, children: childCount })} />
      <Stepper label={t("children")} hint={t("childrenHint")} value={childCount} min={0} max={8} onChange={(n) => onChange({ adults, children: n })} />
    </fieldset>
  );
}
