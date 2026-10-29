"use client";

import { Pause, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { byId, heroSlides } from "@/lib/data";
import { formatCoords } from "@/lib/geo";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";

const DURATION = 7000;
const N = heroSlides.length;

/**
 * Full-screen cinematic slideshow: slides crossfade with a slow Ken Burns push-in.
 * Only the current and next photos are fetched. Rotation stops for reduced-motion users
 * and can be paused; each progress bar jumps to its place.
 */
export function HeroSlideshow() {
  const t = useTranslations("home.hero");
  const td = useTranslations("content.destinations");
  const locale = useLocale();
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loaded, setLoaded] = useState<number[]>([0, 1]);
  // Bumped each time a slide becomes active, to restart its push-in.
  const [runs, setRuns] = useState<number[]>(() => heroSlides.map(() => 0));
  const rotating = playing && !reduce;

  const go = (i: number) => {
    const n = (i + N) % N;
    setLoaded((prev) => Array.from(new Set([...prev, n, (n + 1) % N])));
    setRuns((prev) => prev.map((r, k) => (k === n ? r + 1 : r)));
    setIndex(n);
  };

  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(id);
     
  }, [index, rotating]);

  const words = t("headline").split(" ");
  const current = heroSlides[index];
  const dest = byId.destination(current.destinationId)!;

  return (
    <div className="relative -mt-[var(--header-h)] h-[100svh] min-h-[640px] overflow-hidden bg-black text-white">
      {heroSlides.map((s, i) =>
        loaded.includes(i) ? (
          <div
            key={s.photo.id}
            aria-hidden={i !== index}
            className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-out", i === index ? "opacity-100" : "opacity-0")}
          >
            <div key={runs[i]} className={cn("absolute inset-0", !reduce && "kenburns")}>
              <Photo
                photo={s.photo}
                alt={i === index ? td(`${s.destinationId}.alt`) : ""}
                sizes="100vw"
                preload={i === 0}
                quality={55}
                className="absolute inset-0 h-full"
              />
            </div>
          </div>
        ) : null
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75" />
      <div aria-hidden className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/45 to-transparent" />

      <div className="container-x relative flex h-full flex-col justify-end pb-[clamp(8rem,16vh,11rem)] pt-[calc(var(--header-h)+2rem)]">
        <p className="fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
          <span aria-hidden className="size-2 rounded-full bg-[#ff5a1f]" />
          {t("eyebrow")}
        </p>
        <h1 id="hero-title" className="t-display mt-6 max-w-[11ch]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className="rise" style={{ animationDelay: `${120 + i * 70}ms` }}>
                {w}
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="fade-up t-lead mt-6 max-w-[44ch] text-white/85" style={{ animationDelay: "600ms" }}>
          {t("lead")}
        </p>

        {/* Now showing + controls */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div aria-live={rotating ? "off" : "polite"} className="min-w-0">
            <p key={index} className="fade-up text-sm text-white/75">
              {td(`${current.destinationId}.caption`)} ·{" "}
              <span className="font-semibold text-white">
                {td(`${current.destinationId}.name`)}, {td(`${current.destinationId}.country`)}
              </span>
              <span className="num ml-2 hidden font-mono text-xs text-white/60 sm:inline">{formatCoords(dest.lat, dest.lon, locale)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3" role="group" aria-label={t("slides")}>
            {!reduce && (
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? t("pause") : t("play")}
                className="grid size-10 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20"
              >
                {playing ? <Pause size={15} strokeWidth={2} aria-hidden /> : <Play size={15} strokeWidth={2} aria-hidden />}
              </button>
            )}
            {heroSlides.map((s, i) => (
              <button
                key={s.photo.id}
                type="button"
                onClick={() => go(i)}
                aria-label={t("goTo", { place: td(`${s.destinationId}.name`) })}
                aria-current={i === index ? "true" : undefined}
                className="group grid h-10 w-8 place-items-center sm:w-12"
              >
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/30 group-hover:bg-white/50">
                  {i === index && (
                    <span
                      key={runs[i]}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      style={rotating ? { animation: `progress ${DURATION}ms linear forwards` } : undefined}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
