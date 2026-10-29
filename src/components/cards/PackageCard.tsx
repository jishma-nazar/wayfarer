import { ArrowRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { TripPackage } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { usePrice } from "@/components/ui/Price";

/** Whole-trip card on full-bleed photography, with the route as a monospace chip. */
export function PackageCard({ p, className, sizes = "(min-width: 1024px) 36vw, 85vw" }: { p: TripPackage; className?: string; sizes?: string }) {
  const t = useTranslations("content.packages");
  const tp = useTranslations("home.packages");
  const tc = useTranslations("card");
  const format = useFormatter();
  const price = usePrice();
  const title = t(`${p.id}.title`);
  const highlights = t.raw(`${p.id}.highlights`) as string[];
  const [y, mo] = p.departures.split("-").map(Number);
  const departure = format.dateTime(new Date(Date.UTC(y, mo - 1, 15)), { month: "short", year: "numeric", timeZone: "UTC" });

  return (
    <article className={cn("group relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[28px] bg-[#141417] p-6 text-white sm:p-7", className)}>
      <Photo photo={p.photo} alt="" sizes={sizes} className="absolute inset-0 -z-10 h-full" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/35 to-black/30" />

      <div className="flex items-start justify-between gap-3">
        <p className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/40 px-3 font-mono text-[0.8125rem] backdrop-blur-md">
          <span>{p.fromCode}</span>
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden className="text-[#ff8a5c]" />
          <span>{p.toCode}</span>
          <span className="text-white/60">· {tc("nights", { count: p.nights })}</span>
        </p>
        <SaveButton kind="package" id={p.id} name={title} />
      </div>
      <p className="sr-only">
        {tp("from")} {t(`${p.id}.fromCity`)}, {tp("to")} {t(`${p.id}.toCity`)}
      </p>

      <div>
        <h3 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-[0.95]">{title}</h3>
        <ul className="mt-4 space-y-1 text-[0.9375rem] text-white/80">
          {highlights.slice(0, 2).map((h) => (
            <li key={h} className="flex gap-2">
              <span aria-hidden className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-[#ff5a1f]" />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-5">
          <div>
            <p className="text-xs text-white/70">{tp("pricePrefix")} · {tp("nextDeparture")} <span className="capitalize">{departure}</span></p>
            <p className="num mt-1 font-display text-[2.25rem] font-bold leading-none tracking-[-0.03em]">{price(p.price)}</p>
            <Rating score={p.rating} count={p.reviews} tone="onDark" className="mt-2" />
          </div>
          <Link href={`/enquire?package=${p.id}`} className="btn btn-light">
            {tc("enquire")}
            <span className="sr-only">: {title}</span>
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
