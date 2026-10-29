"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Desktop: the section pins while vertical scroll drives the cards sideways.
 * Phones and reduced motion: a plain swipeable row — same content, no scroll-jacking.
 */
export function PackagesScroller({ eyebrow, title, dek, cta, hint, cards }: { eyebrow: string; title: string; dek: string; cta: string; hint: string; cards: ReactNode[] }) {
  const wide = useMediaQuery("(min-width: 1024px)", false);
  const reduce = useReducedMotion();
  const pinned = wide && !reduce;
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: pinned ? outer : undefined, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const intro = (
    <div className="flex w-[min(86vw,440px)] shrink-0 flex-col justify-between py-2 lg:w-[30vw]">
      <div>
        <p className="eyebrow inline-flex items-center gap-2 text-accent-strong">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h2 id="packages-title" className="t-h1 mt-4">{title}</h2>
        <p className="t-lead mt-5 text-ink-muted">{dek}</p>
      </div>
      <div className="mt-8 flex items-center gap-4">
        <Link href="/packages" className="btn btn-primary">
          {cta} <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
        </Link>
        {pinned && <span className="text-sm text-ink-muted">{hint} →</span>}
      </div>
    </div>
  );

  if (!pinned) {
    return (
      <div className="section-y">
        <div className="container-x">{intro}</div>
        <ul role="list" className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2">
          {cards.map((c, i) => (
            <li key={i} className="w-[84vw] max-w-[440px] shrink-0 snap-start">{c}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={outer} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <m.div ref={track} style={{ x }} className="flex w-max items-stretch gap-6 px-[max(var(--gutter),calc((100vw-var(--max))/2+var(--gutter)))]">
          {intro}
          <ul role="list" className="flex gap-6">
            {cards.map((c, i) => (
              <li key={i} className="h-[min(72vh,640px)] w-[min(36vw,520px)] shrink-0">{c}</li>
            ))}
          </ul>
        </m.div>
        <div aria-hidden className="container-x mt-10">
          <div className="h-[3px] overflow-hidden rounded-full bg-hairline">
            <m.div style={{ scaleX: progress }} className="h-full origin-left rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
