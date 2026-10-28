import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Left-aligned editorial header; the action sits on the right edge, not under a centred title. */
export function SectionHead({ eyebrow, title, dek, action, id, className, tone = "default" }: { eyebrow: string; title: string; dek?: string; action?: ReactNode; id: string; className?: string; tone?: "default" | "onOlive" }) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <p className={cn("eyebrow", tone === "onOlive" ? "text-on-olive/75" : "text-accent-strong")}>{eyebrow}</p>
        <h2 id={id} className="t-h1 mt-3">{title}</h2>
        {dek && <p className={cn("t-lead mt-4 max-w-[56ch]", tone === "onOlive" ? "text-on-olive/80" : "text-ink-muted")}>{dek}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
