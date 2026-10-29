import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

/** Big left-aligned header with the section's one action on the right. */
export function SectionHead({ eyebrow, title, dek, action, id, className }: { eyebrow: string; title: string; dek?: string; action?: ReactNode; id: string; className?: string }) {
  return (
    <Reveal className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-4xl">
        <p className="eyebrow inline-flex items-center gap-2 text-accent-strong">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h2 id={id} className="t-h1 mt-4">{title}</h2>
        {dek && <p className="t-lead mt-5 max-w-[52ch] text-ink-muted">{dek}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
