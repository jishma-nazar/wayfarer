import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { LocalTime } from "@/components/ui/LocalTime";
import { usePrice } from "@/components/ui/Price";

/** Tall image card: everything sits on the photo — place, live local time, nightly "from" price. */
export function DestinationCard({ d, sizes = "(min-width: 1024px) 26vw, (min-width: 640px) 44vw, 78vw", className }: { d: Destination; sizes?: string; className?: string }) {
  const t = useTranslations("content.destinations");
  const tc = useTranslations("card");
  const locale = useLocale();
  const price = usePrice();
  const name = t(`${d.id}.name`);
  const lat = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(d.lat));

  return (
    <article className={cn("group relative isolate aspect-[3/4] overflow-hidden rounded-[24px] bg-paper-2 text-white", className)}>
      <Photo
        photo={d.photo}
        alt={t(`${d.id}.alt`)}
        sizes={sizes}
        className="absolute inset-0 h-full"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.08]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />
      <p className="num absolute left-4 top-4 inline-flex h-8 items-center rounded-full bg-black/35 px-3 font-mono text-[0.7rem] tracking-tight backdrop-blur-md">
        {lat}° {d.lat >= 0 ? "N" : "S"} · <LocalTime timeZone={d.timeZone} place={name} className="ml-1" />
      </p>
      <span aria-hidden className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white text-[#0e0e10] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45">
        <ArrowUpRight size={18} strokeWidth={1.75} />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-sm font-medium text-white/80">{t(`${d.id}.country`)}</p>
        <h3 className="mt-1 text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-[0.95]">
          <Link href={`/search?q=${encodeURIComponent(name)}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
            {name}
          </Link>
        </h3>
        <p className="mt-3 text-sm text-white/85">
          {tc.rich("stayFrom", { price: price(d.fromPrice), b: (c) => <strong className="text-white">{c}</strong> })}
        </p>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[24px] ring-0 ring-inset ring-white/0 transition group-has-[:focus-visible]:ring-4 group-has-[:focus-visible]:ring-[#ff5a1f]" />
    </article>
  );
}
