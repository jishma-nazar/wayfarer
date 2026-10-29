"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades content up as it scrolls into view. Only content that starts below the fold is hidden
 * (after hydration, so no-JS and above-the-fold content are never invisible). Skipped entirely
 * for reduced-motion users.
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    // Hide on the next frame so the transition has a starting point.
    const raf = requestAnimationFrame(() => setState((s) => (s === "idle" ? "hidden" : s)));
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-reveal={state} style={delay ? { transitionDelay: `${delay}ms` } : undefined} className={className}>
      {children}
    </div>
  );
}
