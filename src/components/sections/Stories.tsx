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

const INTERVAL = 8000;

/**
 * Full-bleed testimonial slideshow: the traveller's photo fills the section, the quote sits on it.
 * Rotates unless reduced motion is on; pauses on hover/focus; explicit pause, prev/next and dots.
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
      className="relative isolate flex min-h-[min(100svh,900px)] flex-col justify-end overflow-hidden bg-black text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => !region.current?.contains(e.relatedTarget as Node) && setHovered(false)}
    >
      <AnimatePresence initial={false}>
        <m.div
          key={s.id}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Photo photo={s.photo} alt={ts(`${s.id}.alt`)} sizes="100vw" className="h-full" />
        </m.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

      <div className="container-x pb-12 pt-[calc(var(--section-y)+2rem)] lg:pb-16">
        <div className="flex items-center justify-between gap-6">
          <p className="eyebrow inline-flex items-center gap-2 text-[#ff8a5c]">
            <span aria-hidden className="size-1.5 rounded-full bg-[#ff5a1f]" />
            <span id="stories-title">{t("eyebrow")}</span>
          </p>
          <p className="num font-mono text-sm text-white/70" aria-hidden>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        <div aria-live={rotating ? "off" : "polite"} className="mt-8 min-h-[16rem] lg:min-h-[18rem]">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={t("position", { current: index + 1, total })}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
            >
              <blockquote>
                <p className="max-w-[24ch] font-display text-[clamp(2rem,1.2rem+3.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                  “{ts(`${s.id}.quote`)}”
                </p>
              </blockquote>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span>
                  <span className="block text-lg font-semibold">{ts(`${s.id}.name`)}</span>
                  <span className="block text-sm text-white/75">
                    {ts(`${s.id}.home`)} · {ts(`${s.id}.trip`)}
                  </span>
                </span>
                <Rating score={s.rating} count={1} compact tone="onDark" />
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
          <div className="flex gap-1">
            {stories.map((st, i) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("goTo", { n: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                className="group grid h-11 w-12 place-items-center"
              >
                <span className={cn("block h-[3px] w-full rounded-full transition-colors", i === index ? "bg-white" : "bg-white/30 group-hover:bg-white/60")} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!reduce && (
              <button type="button" onClick={() => setPlaying((p) => !p)} className="btn btn-glass px-4" aria-label={playing ? t("pause") : t("play")}>
                {playing ? <Pause size={16} strokeWidth={1.75} aria-hidden /> : <Play size={16} strokeWidth={1.75} aria-hidden />}
                <span className="hidden sm:inline">{playing ? t("pause") : t("play")}</span>
              </button>
            )}
            <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20" aria-label={t("prev")}>
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full bg-white text-[#0e0e10] hover:bg-[#ffe8de]" aria-label={t("next")}>
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
