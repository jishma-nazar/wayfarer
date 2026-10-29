import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { destinations } from "@/lib/data";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";

/** Two rows of destinations drifting in opposite directions. Pauses on hover/focus; static for reduced motion. */
export function Marquee() {
  const t = useTranslations("home.marquee");
  const half = Math.ceil(destinations.length / 2);
  const rows = [destinations.slice(0, half), destinations.slice(half)];

  return (
    <section aria-label={t("label")} className="relative overflow-hidden py-14 lg:py-20">
      <div className="space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="marquee flex overflow-hidden">
            <ul
              className={cn("marquee-track flex w-max shrink-0 gap-4 pr-4", r === 1 && "reverse")}
              style={{ ["--marquee-dur" as string]: `${row.length * 6}s` }}
            >
              {[...row, ...row].map((d, i) => (
                <Pill key={`${d.id}-${i}`} d={d} hidden={i >= row.length} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pill({ d, hidden }: { d: Destination; hidden: boolean }) {
  const t = useTranslations("content.destinations");
  const name = t(`${d.id}.name`);
  return (
    <li aria-hidden={hidden || undefined}>
      <Link
        href={`/search?q=${encodeURIComponent(name)}`}
        tabIndex={hidden ? -1 : undefined}
        className="group flex h-20 items-center gap-4 rounded-full border border-hairline bg-surface py-2 pl-2 pr-7 transition-colors hover:border-ink lg:h-24"
      >
        <Photo photo={d.photo} alt="" sizes="96px" className="aspect-square h-full rounded-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
        <span className="whitespace-nowrap">
          <span className="block font-display text-2xl font-semibold leading-none tracking-[-0.03em] lg:text-[2rem]">{name}</span>
          <span className="mt-1 block text-sm text-ink-muted">{t(`${d.id}.country`)}</span>
        </span>
      </Link>
    </li>
  );
}
