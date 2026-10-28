"use client";

import { Clock, MapPin, TrendingUp, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { buildIndex, POPULAR_DESTINATIONS, searchIndex, type IndexEntry } from "@/lib/search";
import { recentStore, useSavedRecent } from "./recent";
import { cn } from "@/lib/cn";

type Option = { key: string; label: string; sub?: string; kind: "recent" | "popular" | IndexEntry["kind"] };

/**
 * Destination combobox (WAI-ARIA 1.2 pattern). Empty → recent + popular searches;
 * typing → accent- and typo-tolerant suggestions across places, stays and experiences.
 */
export function DestinationField({
  value,
  onChange,
  error,
  onSubmitRequest,
  inputRef,
  autoFocus,
  stacked,
}: {
  value: string;
  onChange: (value: string, destinationId?: string) => void;
  error?: string;
  onSubmitRequest: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
  stacked?: boolean;
}) {
  const t = useTranslations("search");
  const tc = useTranslations("content");
  const locale = useLocale();
  const id = useId();
  const listId = `${id}-list`;
  const errorId = `${id}-error`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const recent = useSavedRecent();
  const blurTimer = useRef<number | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild only when the language changes
  const index = useMemo(() => buildIndex((k) => tc(k)), [locale]);

  const groups = useMemo(() => {
    if (value.trim()) {
      const hits = searchIndex(index, value);
      return [{ title: t("suggestions"), options: hits.map<Option>((h) => ({ key: `${h.kind}:${h.id}`, label: h.label, sub: h.sub, kind: h.kind })) }];
    }
    const popular = POPULAR_DESTINATIONS.map<Option>((d) => ({ key: `popular:${d}`, label: tc(`destinations.${d}.name`), sub: tc(`destinations.${d}.country`), kind: "popular" }));
    return [
      ...(recent.length ? [{ title: t("recent"), options: recent.map<Option>((r) => ({ key: `recent:${r}`, label: r, kind: "recent" })) }] : []),
      { title: t("popular"), options: popular },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, index, recent, locale]);

  const flat = groups.flatMap((g) => g.options);
  const showList = open && (flat.length > 0 || !!value.trim());

  const choose = (opt: Option) => {
    const destId = opt.key.startsWith("destination:") || opt.key.startsWith("popular:") ? opt.key.split(":")[1] : undefined;
    onChange(opt.label, destId);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (flat.length ? (a + 1) % flat.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (flat.length ? (a <= 0 ? flat.length - 1 : a - 1) : -1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && flat[active]) {
        e.preventDefault();
        choose(flat[active]);
      } else {
        e.preventDefault();
        setOpen(false);
        onSubmitRequest();
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        setActive(-1);
      } else if (value) {
        onChange("");
      }
    }
  };

  const optionId = (i: number) => `${id}-opt-${i}`;
  let running = -1;

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="field-label">
        {t("destination")}
      </label>
      <div className="relative">
        <MapPin size={18} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          autoFocus={autoFocus}
          data-autofocus={autoFocus || undefined}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={t("destinationPlaceholder")}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            window.clearTimeout(blurTimer.current);
            setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          className="field pl-10 pr-11"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef?.current?.focus();
            }}
            className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-sm text-ink-muted hover:text-ink"
          >
            <X size={16} strokeWidth={1.5} aria-hidden />
            <span className="sr-only">{t("clearField")}</span>
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        {open && value.trim() ? t("suggestionCount", { count: flat.length }) : ""}
      </p>

      <div
        className={cn(
          showList ? "block" : "hidden",
          stacked
            ? "mt-2"
            : "absolute left-0 right-0 top-full z-30 mt-2 min-w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-hairline bg-surface py-2 shadow-float"
        )}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ul id={listId} role="listbox" aria-label={t("destination")} className="max-h-[min(60vh,24rem)] overflow-y-auto">
          {groups.map((g) => (
            <li key={g.title} role="presentation">
              <div aria-hidden className="flex items-center justify-between px-4 pb-1 pt-2">
                <span className="eyebrow text-ink-faint">{g.title}</span>
                {g.title === t("recent") && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => recentStore.set([])}
                    className="min-h-8 text-xs font-semibold text-ink-muted underline underline-offset-2 hover:text-ink"
                  >
                    {t("clearRecent")}
                  </button>
                )}
              </div>
              <ul role="group" aria-label={g.title}>
                {g.options.map((opt) => {
                  running += 1;
                  const i = running;
                  const Icon = opt.kind === "recent" ? Clock : opt.kind === "popular" ? TrendingUp : MapPin;
                  return (
                    <li
                      key={opt.key}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      onClick={() => choose(opt)}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-3 px-4 py-2",
                        i === active ? "bg-paper-2" : ""
                      )}
                    >
                      <Icon size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-ink-muted" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{opt.label}</span>
                        {opt.sub && <span className="block truncate text-sm text-ink-muted">{opt.sub}</span>}
                      </span>
                      {opt.kind !== "recent" && opt.kind !== "popular" && (
                        <span className="shrink-0 text-xs text-ink-faint">{t(`kind.${opt.kind}`)}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        {value.trim() && flat.length === 0 && <p className="px-4 py-3 text-sm text-ink-muted">{t("noMatch", { query: value.trim() })}</p>}
      </div>
    </div>
  );
}
