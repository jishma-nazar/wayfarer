"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Image reveal mask: the frame wipes open once as it enters the viewport.
 * Content is in the DOM from the start (no layout shift, no hidden text); MotionConfig
 * turns this into an instant show for reduced-motion users.
 */
export function Reveal({ children, className, from = "bottom", delay = 0 }: { children: ReactNode; className?: string; from?: "bottom" | "left"; delay?: number }) {
  const hidden = from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return (
    <m.div
      className={className}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay }}
    >
      {children}
    </m.div>
  );
}
