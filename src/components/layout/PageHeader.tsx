import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, dek, children }: { eyebrow?: string; title: string; dek?: string; children?: ReactNode }) {
  return (
    <header className="container-x pb-8 pt-10 md:pb-10 md:pt-16">
      {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
      <h1 className="t-h1 mt-2 max-w-[20ch]">{title}</h1>
      {dek && <p className="t-lead mt-4 max-w-[60ch] text-ink-muted">{dek}</p>}
      {children}
    </header>
  );
}
