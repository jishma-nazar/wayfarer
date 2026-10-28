"use client";

import { m } from "framer-motion";
import { CalendarDays, Plane, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import type { DatePreset } from "@/lib/dates";
import { pushRecent } from "@/lib/saved";
import { useDraft } from "@/lib/store";
import { SEARCH_TABS, type SearchTab } from "@/lib/types";
import { cn } from "@/lib/cn";
import { DestinationField } from "./DestinationField";
import { GuestsPanel, useWhenSummary, validateDates, WhenPanel } from "./fields";
import { Popover } from "./Popover";
import { Sheet } from "@/components/ui/Sheet";

export interface SearchState {
  tab: SearchTab;
  query: string;
  destinationId?: string;
  origin: string;
  when: DatePreset;
  checkIn?: string;
  checkOut?: string;
  adults: number;
  children: number;
}

export const SEARCH_DEFAULTS: SearchState = { tab: "all", query: "", origin: "", when: "flexible", adults: 2, children: 0 };

export function toSearchParams(s: SearchState) {
  const p = new URLSearchParams();
  if (s.tab !== "all") p.set("type", s.tab);
  if (s.query.trim()) p.set("q", s.query.trim());
  if (s.tab === "flights" && s.origin.trim()) p.set("from", s.origin.trim());
  if (s.when !== "flexible") p.set("when", s.when);
  if (s.checkIn) p.set("in", s.checkIn);
  if (s.checkOut) p.set("out", s.checkOut);
  if (s.adults !== 2) p.set("adults", String(s.adults));
  if (s.children) p.set("children", String(s.children));
  return p;
}

interface Props {
  /** `hero` shows the trust row and the mobile summary card. */
  variant?: "hero" | "page";
  initial?: Partial<SearchState>;
  /** Persist the form in sessionStorage under this key (survives language switches). */
  persistKey?: string;
  className?: string;
}

export function SearchModule({ variant = "hero", initial, persistKey, className }: Props) {
  const t = useTranslations("search");
  const router = useRouter();
  const seed = { ...SEARCH_DEFAULTS, ...initial };
  const [draft, updateDraft] = useDraft<SearchState>(persistKey ?? "search-ephemeral", seed);
  const [local, setLocal] = useState<SearchState>(seed);
  const state = persistKey ? draft : local;
  const update = (patch: Partial<SearchState>) => (persistKey ? updateDraft(patch) : setLocal((p) => ({ ...p, ...patch })));

  const [error, setError] = useState<string>();
  const [dateErrors, setDateErrors] = useState<{ checkIn?: string; checkOut?: string }>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [whenOpen, setWhenOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const inlineInput = useRef<HTMLInputElement>(null);
  const sheetInput = useRef<HTMLInputElement>(null);
  const whenSummary = useWhenSummary();
  const guestSummary = t("guestsSummary", { adults: state.adults, children: state.children });

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!state.query.trim()) {
      setError(t("errors.destinationRequired"));
      (sheetOpen ? sheetInput : inlineInput).current?.focus();
      return;
    }
    const dErr = validateDates(state, t);
    setDateErrors(dErr);
    if (dErr.checkIn || dErr.checkOut) {
      setWhenOpen(true);
      return;
    }
    setError(undefined);
    pushRecent(state.query);
    setSheetOpen(false);
    router.push(`/search?${toSearchParams(state).toString()}`);
  };

  const setQuery = (query: string, destinationId?: string) => {
    update({ query, destinationId });
    if (error && query.trim()) setError(undefined);
  };

  const tabs = (name: string, scroll?: boolean) => (
    <fieldset className={cn(scroll && "-mx-4 overflow-x-auto px-4 no-scrollbar")}>
      <legend className="sr-only">{t("tabsLabel")}</legend>
      <div className="flex gap-1 border-b border-hairline">
        {SEARCH_TABS.map((tab) => (
          <label
            key={tab}
            className={cn(
              "relative inline-flex min-h-11 shrink-0 cursor-pointer items-center px-3 text-[0.9375rem] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)]",
              state.tab === tab ? "text-ink" : "text-ink-muted hover:text-ink"
            )}
          >
            <input type="radio" name={name} value={tab} checked={state.tab === tab} onChange={() => update({ tab })} className="sr-only" />
            {t(`tabs.${tab}`)}
            {state.tab === tab && <m.span layoutId={`${name}-tab`} aria-hidden className="absolute inset-x-2 -bottom-px h-[2px] bg-accent" />}
          </label>
        ))}
      </div>
    </fieldset>
  );

  const originField = (id: string) =>
    state.tab === "flights" && (
      <div>
        <label htmlFor={id} className="field-label">
          {t("origin")} <span className="font-normal text-ink-muted">({t("originOptional")})</span>
        </label>
        <div className="relative">
          <Plane size={18} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input id={id} type="text" autoComplete="off" enterKeyHint="next" placeholder={t("originPlaceholder")} value={state.origin} onChange={(e) => update({ origin: e.target.value })} className="field pl-10" />
        </div>
      </div>
    );

  const uid = useId();

  return (
    <div className={className}>
      {/* ——— Tablet & desktop: inline module ——— */}
      <form onSubmit={submit} role="search" aria-label={t("label")} noValidate className="@container hidden md:block">
        {tabs(`${uid}-tabs`)}
        <div
          className={cn(
            // Laid out by the module's own width (container queries), not the viewport, so it
            // works full-width in the hero and in narrower columns (404 page, results header).
            "mt-5 grid grid-cols-2 items-end gap-3 [&>*:first-child]:col-span-2",
            state.tab === "flights"
              ? "[&>*:nth-child(2)]:col-span-2 @min-[46rem]:grid-cols-2 @min-[46rem]:[&>*:first-child]:col-span-1 @min-[46rem]:[&>*:nth-child(2)]:col-span-1 @min-[56rem]:grid-cols-[1fr_1.3fr_1fr_1fr_auto]"
              : "@min-[46rem]:grid-cols-[1.6fr_1fr_1fr] @min-[46rem]:[&>*:first-child]:col-span-1 @min-[52rem]:grid-cols-[1.8fr_1fr_1fr_auto]"
          )}
        >
          {originField(`${uid}-origin`)}
          <div className="self-start">
            <DestinationField value={state.query} onChange={setQuery} error={error} onSubmitRequest={() => submit()} inputRef={inlineInput} />
          </div>
          <div className="self-start">
            <span id={`${uid}-when-l`} className="field-label">{t("when")}</span>
            <Popover
              open={whenOpen}
              onOpenChange={setWhenOpen}
              label={t("when")}
              panelClassName="w-[min(24rem,calc(100vw-2rem))]"
              trigger={(p) => (
                <button type="button" {...p} id={`${uid}-when`} aria-labelledby={`${uid}-when-l ${uid}-when`} className="field flex items-center gap-2.5 text-left">
                  <CalendarDays size={18} strokeWidth={1.5} aria-hidden className="shrink-0 text-ink-muted" />
                  <span className="truncate">{whenSummary(state)}</span>
                </button>
              )}
            >
              <WhenPanel value={state} onChange={(v) => update(v)} errors={dateErrors} onBlurValidate={() => setDateErrors(validateDates(state, t))} />
              <button type="button" onClick={() => setWhenOpen(false)} className="btn btn-ink mt-4 w-full">{t("done")}</button>
            </Popover>
          </div>
          <div className="self-start">
            <span id={`${uid}-who-l`} className="field-label">{t("who")}</span>
            <Popover
              open={whoOpen}
              onOpenChange={setWhoOpen}
              label={t("who")}
              align="end"
              panelClassName="w-[min(22rem,calc(100vw-2rem))]"
              trigger={(p) => (
                <button type="button" {...p} id={`${uid}-who`} aria-labelledby={`${uid}-who-l ${uid}-who`} className="field flex items-center gap-2.5 text-left">
                  <Users size={18} strokeWidth={1.5} aria-hidden className="shrink-0 text-ink-muted" />
                  <span className="truncate">{guestSummary}</span>
                </button>
              )}
            >
              <GuestsPanel adults={state.adults} childCount={state.children} onChange={(v) => update(v)} />
              <button type="button" onClick={() => setWhoOpen(false)} className="btn btn-ink mt-2 w-full">{t("done")}</button>
            </Popover>
          </div>
          <button
            type="submit"
            className={cn(
              "btn btn-primary col-span-full h-12 self-start",
              state.tab === "flights" ? "@min-[56rem]:col-span-1 @min-[56rem]:mt-[1.6875rem]" : "@min-[52rem]:col-span-1 @min-[52rem]:mt-[1.6875rem]"
            )}
          >
            <Search size={18} strokeWidth={1.5} aria-hidden />
            {t(`submit.${state.tab}`)}
          </button>
        </div>
      </form>

      {/* ——— Phone: one tappable card that opens a full-screen sheet ——— */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          className="flex w-full items-center gap-4 rounded-lg border border-hairline-strong bg-surface p-4 text-left text-ink transition-colors hover:border-ink"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-strong text-accent-ink">
            <Search size={20} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl leading-tight">{state.query.trim() || t("mobilePrompt")}</span>
            <span className="block truncate text-sm text-ink-muted">
              {[t(`tabs.${state.tab}`), whenSummary(state), guestSummary].join(" · ")}
            </span>
          </span>
        </button>
        {variant === "hero" && <p className="mt-2 px-1 text-sm text-ink-muted">{t("mobileHint")}</p>}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t("sheetTitle")} closeLabel={t("closeSheet")} className="md:hidden">
        <form onSubmit={submit} role="search" aria-label={t("label")} noValidate className="flex min-h-full flex-col">
          <div className="flex-1 space-y-6 px-4 pb-6 pt-2">
            {tabs(`${uid}-sheet-tabs`, true)}
            {originField(`${uid}-sheet-origin`)}
            <DestinationField value={state.query} onChange={setQuery} error={error} onSubmitRequest={() => submit()} inputRef={sheetInput} autoFocus stacked />
            <WhenPanel value={state} onChange={(v) => update(v)} errors={dateErrors} onBlurValidate={() => setDateErrors(validateDates(state, t))} />
            <GuestsPanel adults={state.adults} childCount={state.children} onChange={(v) => update(v)} />
          </div>
          <div className="sticky bottom-0 border-t border-hairline bg-paper p-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
            <button type="submit" className="btn btn-primary h-12 w-full text-base">
              <Search size={18} strokeWidth={1.5} aria-hidden />
              {t(`submit.${state.tab}`)}
            </button>
          </div>
        </form>
      </Sheet>
    </div>
  );
}
