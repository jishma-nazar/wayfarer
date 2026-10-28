import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Destination } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { LocalTime } from "@/components/ui/LocalTime";
import { usePrice } from "@/components/ui/Price";

/** Tall portrait card: place, country, latitude + live local time, nightly "from" price. */
export function DestinationCard({ d, sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 72vw" }: { d: Destination; sizes?: string }) {
  const t = useTranslations("content.destinations");
  const tc = useTranslations("card");
  const locale = useLocale();
  const price = usePrice();
  const name = t(`${d.id}.name`);
  const lat = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(d.lat));

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-sm">
        <Photo
          photo={d.photo}
          alt={t(`${d.id}.alt`)}
          sizes={sizes}
          className="aspect-[3/4]"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-10 text-xs text-[#f4efe6]/90">
          {t(`${d.id}.caption`)}
        </p>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="t-h3">
          <Link href={`/search?q=${encodeURIComponent(name)}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
            {name}
          </Link>
        </h3>
        <span className="shrink-0 text-sm text-ink-muted">{t(`${d.id}.country`)}</span>
      </div>
      <p className="num mt-1 font-mono text-[0.75rem] tracking-tight text-ink-muted">
        {lat}° {d.lat >= 0 ? "N" : "S"} · <LocalTime timeZone={d.timeZone} place={name} />
      </p>
      <p className="mt-2 text-[0.9375rem]">
        {tc.rich("stayFrom", { price: price(d.fromPrice), b: (c) => <strong>{c}</strong> })}
      </p>
    </article>
  );
}
