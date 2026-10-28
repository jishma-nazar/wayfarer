"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { stories } from "@/lib/data";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";

const INTERVAL = 9000;

/**
 * Pull-quote carousel. Rotates slowly unless the visitor prefers reduced motion,
 * pauses on hover/focus, and has explicit pause/play, prev/next and position controls.
 */
export function Stories() {
  const t = useTranslations("home.stories");
  const ts = useTranslations("content.stories");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const region = useRef<HTMLElement>(null);
  const rotating = playing && !hovered && !reduce;
  const total = stories.length;
  const s = stories[index];

  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), INTERVAL);
    return () => window.clearTimeout(id);
  }, [rotating, index, total]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

  return (
    <section
      ref={region}
      aria-labelledby="stories-title"
      aria-roledescription="carousel"
      className="container-x section-y"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => !region.current?.contains(e.relatedTarget as Node) && setHovered(false)}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
          <h2 id="stories-title" className="t-h1 mt-3">{t("title")}</h2>
        </div>
        <div className="flex items-center gap-2">
          {!reduce && (
            <button type="button" onClick={() => setPlaying((p) => !p)} className="btn btn-ghost px-3" aria-label={playing ? t("pause") : t("play")}>
              {playing ? <Pause size={16} strokeWidth={1.5} aria-hidden /> : <Play size={16} strokeWidth={1.5} aria-hidden />}
              <span className="hidden sm:inline">{playing ? t("pause") : t("play")}</span>
            </button>
          )}
          <button type="button" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-sm border border-hairline-strong hover:border-ink" aria-label={t("prev")}>
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} className="grid size-11 place-items-center rounded-sm border border-hairline-strong hover:border-ink" aria-label={t("next")}>
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-hairline pt-10" aria-live={rotating ? "off" : "polite"}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={t("position", { current: index + 1, total })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-7 lg:pt-4">
              <blockquote>
              <span aria-hidden className="block font-display text-[5rem] leading-[0.6] text-accent">“</span>
              <p className="font-display text-[clamp(1.625rem,1.1rem+2.2vw,2.875rem)] leading-[1.15] tracking-[-0.015em]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 72' }}>
                {ts(`${s.id}.quote`)}
              </p>
              </blockquote>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span>
                  <span className="block font-semibold">{ts(`${s.id}.name`)}</span>
                  <span className="block text-sm text-ink-muted">
                    {ts(`${s.id}.home`)} · {ts(`${s.id}.trip`)}
                  </span>
                </span>
                <Rating score={s.rating} count={1} compact />
              </div>
            </div>
            <div className="lg:col-span-5">
              <Photo photo={s.photo} alt={ts(`${s.id}.alt`)} sizes="(min-width: 1024px) 38vw, 100vw" className="aspect-[4/3] rounded-sm lg:aspect-[4/5]" />
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <p className="num font-mono text-sm text-ink-muted" aria-hidden>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="flex gap-1">
          {stories.map((st, i) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("goTo", { n: i + 1 })}
              aria-current={i === index ? "true" : undefined}
              className="group grid h-11 w-9 place-items-center"
            >
              <span className={cn("block h-[2px] w-full transition-colors", i === index ? "bg-ink" : "bg-hairline-strong group-hover:bg-ink-muted")} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
