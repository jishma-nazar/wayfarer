"use client";

import { AnimatePresence, m } from "framer-motion";
import { useId, useRef, type ReactNode } from "react";
import { useFocusTrap, useOnClickOutside } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/** Button + floating panel. Escape / outside click closes; focus returns to the trigger. */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  label,
  className,
  panelClassName,
  align = "start",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: { "aria-expanded": boolean; "aria-controls": string; onClick: () => void }) => ReactNode;
  children: ReactNode;
  label: string;
  className?: string;
  panelClassName?: string;
  align?: "start" | "end";
}) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrap, () => onOpenChange(false), open);
  useFocusTrap(panel, open, () => onOpenChange(false));

  return (
    <div ref={wrap} className={cn("relative", className)}>
      {trigger({ "aria-expanded": open, "aria-controls": id, onClick: () => onOpenChange(!open) })}
      <AnimatePresence>
        {open && (
          <m.div
            ref={panel}
            id={id}
            role="dialog"
            aria-label={label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18 }}
            className={cn(
              "absolute top-[calc(100%+8px)] z-30 rounded-lg border border-hairline bg-surface p-4 text-ink shadow-float",
              align === "end" ? "right-0" : "left-0",
              panelClassName
            )}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
