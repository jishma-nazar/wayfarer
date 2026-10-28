"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap, useMounted, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Full-screen modal sheet for phones: focus trapped, Escape closes, page scroll locked.
 * Portalled to <body> so a parent's stacking context (e.g. the hero) can't trap it under the header.
 */
export function Sheet({ open, onClose, title, closeLabel, children, className }: { open: boolean; onClose: () => void; title: string; closeLabel: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  useScrollLock(open);
  useFocusTrap(ref, open, onClose);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ y: "4%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "4%", opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.3 }}
          className={cn("fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-paper text-ink", className)}
        >
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-hairline bg-paper px-2">
            <button type="button" onClick={onClose} className="inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-semibold hover:bg-paper-2">
              <ArrowLeft size={20} strokeWidth={1.5} aria-hidden />
              <span>{closeLabel}</span>
            </button>
          </div>
          {children}
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
