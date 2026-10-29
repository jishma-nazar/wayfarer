"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
  itemClassName?: string;
  className?: string;
  /** Section header rendered on the left of the arrow row (keeps arrows next to the title). */
  header?: ReactNode;
  /** Extra action (e.g. "See all") placed before the arrows. */
  action?: ReactNode;
}

/**
 * Native scroll-snap row: momentum and physics come from the platform (touch, trackpad,
 * shift+wheel), arrows on wider screens page by ~one viewport. Edges align with the
 * page container while the row itself bleeds to the window edge.
 */
export function Carousel({ label, prevLabel, nextLabel, children, itemClassName, className, header, action }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  const controls = (
    <div className="hidden gap-2 md:flex">
      <button type="button" onClick={() => page(-1)} disabled={edges.start} aria-label={prevLabel}
        className="grid size-12 place-items-center rounded-full border border-hairline-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:cursor-default disabled:opacity-30 disabled:hover:border-hairline-strong disabled:hover:bg-transparent disabled:hover:text-ink">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
      </button>
      <button type="button" onClick={() => page(1)} disabled={edges.end} aria-label={nextLabel}
        className="grid size-12 place-items-center rounded-full border border-hairline-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:cursor-default disabled:opacity-30 disabled:hover:border-hairline-strong disabled:hover:bg-transparent disabled:hover:text-ink">
        <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );

  return (
    <div className={className}>
      <div className="container-x mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {header}
        <div className="flex items-center gap-6">
          {action}
          {controls}
        </div>
      </div>
      <section aria-roledescription="carousel" aria-label={label}>
        <ul
          ref={ref}
          role="list"
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 sm:gap-6"
          style={{
            paddingInline: "max(var(--gutter), calc((100% - var(--max)) / 2 + var(--gutter)))",
            scrollPaddingInline: "max(var(--gutter), calc((100% - var(--max)) / 2 + var(--gutter)))",
          }}
        >
          {Children.map(children, (child, i) => (
            <li key={i} className={cn("shrink-0 snap-start", itemClassName)}>
              {child}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
