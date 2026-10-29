"use client";

import { animate, useInView } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

/** Counts up to `value` once it scrolls into view. */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // Server HTML (and no-JS) shows the final number; the count runs once, when it scrolls into view.
  const [shown, setShown] = useState(value);
  const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(0, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setShown });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt.format(shown)}
      {suffix}
    </span>
  );
}
