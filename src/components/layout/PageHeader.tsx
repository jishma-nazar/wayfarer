import type { ReactNode } from "react";
import type { Photo as PhotoT } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";

/** Page title. With a photo it becomes a full-width rounded banner with the title on the image. */
export function PageHeader({ eyebrow, title, dek, photo, children }: { eyebrow?: string; title: string; dek?: string; photo?: PhotoT; children?: ReactNode }) {
  if (photo) {
    return (
      <header className="container-x pb-8 pt-2">
        <div className="relative isolate flex min-h-[min(52svh,520px)] flex-col justify-end overflow-hidden rounded-[32px] p-6 text-white sm:p-10 lg:p-14">
          <Photo photo={photo} alt="" sizes="(min-width: 1440px) 1360px, 100vw" preload className="absolute inset-0 -z-10 h-full" imgClassName="kenburns" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          {eyebrow && <p className="eyebrow text-white/80">{eyebrow}</p>}
          <h1 className="t-display fade-up mt-2 max-w-[14ch] text-[clamp(3rem,1.6rem+6vw,7.5rem)]">{title}</h1>
          {dek && <p className="t-lead fade-up mt-5 max-w-[56ch] text-white/85" style={{ animationDelay: "200ms" }}>{dek}</p>}
          {children}
        </div>
      </header>
    );
  }
  return (
    <header className="container-x pb-8 pt-10 md:pb-10 md:pt-16">
      {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
      <h1 className="t-h1 mt-2 max-w-[20ch]">{title}</h1>
      {dek && <p className="t-lead mt-4 max-w-[60ch] text-ink-muted">{dek}</p>}
      {children}
    </header>
  );
}
