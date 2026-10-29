"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { byId } from "@/lib/data";
import { formatCoords, project } from "@/lib/geo";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { LocalTime } from "@/components/ui/LocalTime";
import { usePrice } from "@/components/ui/Price";

export function MapPins({ ids, route, width: W, height: H, label }: { ids: string[]; route: string; width: number; height: number; label: string }) {
  const t = useTranslations("home.map");
  const td = useTranslations("content.destinations");
  const tc = useTranslations("card");
  const locale = useLocale();
  const price = usePrice();
  const [selected, setSelected] = useState<string | null>("lisbon");
  const reduce = useReducedMotion();
  const maskId = useId().replace(/:/g, "");
  const dest = selected ? byId.destination(selected) : undefined;
  const pos = dest ? project(dest.lon, dest.lat) : undefined;

  const card = dest && (
    <m.div
      key={dest.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.22 }}
      className="flex w-full gap-4 rounded-[22px] border border-hairline bg-surface p-3 shadow-float sm:w-[23rem]"
      role="region"
      aria-live="polite"
      aria-label={td(`${dest.id}.name`)}
    >
      <Photo photo={dest.photo} alt="" sizes="112px" className="aspect-square w-24 shrink-0 rounded-[14px] sm:w-28" />
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-2xl font-semibold leading-none tracking-[-0.03em]">
            {td(`${dest.id}.name`)}
            <span className="block font-sans text-sm text-ink-muted">{td(`${dest.id}.country`)}</span>
          </p>
          <button type="button" onClick={() => setSelected(null)} className="-mr-1.5 -mt-1.5 grid size-11 shrink-0 place-items-center rounded-sm text-ink-muted hover:text-ink" aria-label={t("close")}>
            <X size={16} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <p className="num mt-1 font-mono text-[0.6875rem] text-ink-muted">{formatCoords(dest.lat, dest.lon, locale)}</p>
        <p className="num font-mono text-[0.6875rem] text-ink-muted"><LocalTime timeZone={dest.timeZone} place={td(`${dest.id}.name`)} /></p>
        <Link href={`/search?q=${encodeURIComponent(td(`${dest.id}.name`))}`} className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-accent-strong link-underline">
          {tc("seeTrips", { place: td(`${dest.id}.name`) })} <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
        </Link>
        <p className="sr-only">{tc.rich("stayFrom", { price: price(dest.fromPrice), b: (c) => c })}</p>
      </div>
    </m.div>
  );

  return (
    <div>
      <div className="relative">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          {/* Land dots: a cached static SVG used as a mask, coloured by the theme token. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-hairline-strong"
            style={{ mask: "url(/map-dots.svg) center / 100% 100% no-repeat", WebkitMask: "url(/map-dots.svg) center / 100% 100% no-repeat" }}
          />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
            <defs>
              {/* The dashed route is revealed through a solid stroke that draws itself in. */}
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <m.path
                  d={route}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="8"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 3.2, ease: [0.65, 0, 0.35, 1] }}
                />
              </mask>
            </defs>
            <path d={route} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="5 6" strokeLinecap="round" vectorEffect="non-scaling-stroke" mask={`url(#${maskId})`} />
            {!reduce && (
              <circle r="4" fill="#fff">
                <animateMotion dur="14s" begin="3s" repeatCount="indefinite" path={route} rotate="auto" />
              </circle>
            )}
          </svg>
        </div>
        {/* Pins are a pointer shortcut; keyboard and screen-reader users get the full-size chips below. */}
        <ul aria-hidden>
          {ids.map((id) => {
            const d = byId.destination(id)!;
            const p = project(d.lon, d.lat);
            const active = selected === id;
            return (
              <li key={id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setSelected(active ? null : id)}
                  className="group grid size-11 place-items-center rounded-full"
                >
                  <span className="relative grid place-items-center">
                    <span aria-hidden className="ping absolute size-3 rounded-full bg-accent" />
                    <span
                      className={cn(
                        "relative block rounded-full border-2 border-paper transition-all duration-200",
                        active ? "size-4 bg-accent ring-4 ring-accent/30" : "size-3 bg-white group-hover:bg-accent"
                      )}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {/* Desktop: card floats beside the selected pin, flipping sides near the right edge. */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          <AnimatePresence>
            {dest && pos && (
              <div
                className="pointer-events-auto absolute"
                style={{
                  left: pos.x > 55 ? undefined : `calc(${pos.x}% + 18px)`,
                  right: pos.x > 55 ? `calc(${100 - pos.x}% + 18px)` : undefined,
                  top: pos.y > 60 ? undefined : `calc(${pos.y}% - 24px)`,
                  bottom: pos.y > 60 ? `calc(${100 - pos.y}% - 24px)` : undefined,
                }}
              >
                {card}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Phone: card sits under the map; names listed as chips so nothing depends on hitting a tiny pin. */}
      <div className="mt-4 sm:hidden">
        <AnimatePresence mode="wait">{card}</AnimatePresence>
      </div>
      <div role="group" aria-label={t("listLabel")} className="mt-6 flex flex-wrap gap-2">
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            aria-pressed={selected === id}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
              selected === id ? "border-accent bg-accent text-accent-ink" : "border-hairline-strong text-ink-muted hover:border-ink hover:text-ink"
            )}
          >
            {td(`${id}.name`)}
          </button>
        ))}
      </div>
    </div>
  );
}
