import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Stay } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { FavoriteBadge } from "@/components/ui/FavoriteBadge";
import { usePrice } from "@/components/ui/Price";

/**
 * Image-first stay card. `fill` makes it take its grid cell's height (bento layout);
 * otherwise it keeps a portrait ratio.
 */
export function StayCard({ s, feature, fill, sizes, className }: { s: Stay; feature?: boolean; fill?: boolean; sizes?: string; className?: string }) {
  const t = useTranslations("content.stays");
  const tc = useTranslations("card");
  const price = usePrice();
  const name = t(`${s.id}.name`);

  return (
    <article className={cn("group relative isolate overflow-hidden rounded-[24px] bg-paper-2 text-white", fill ? "h-full min-h-[420px]" : feature ? "aspect-[4/5] sm:aspect-[5/4]" : "aspect-[4/5]", className)}>
      <Photo
        photo={s.photo}
        alt={t(`${s.id}.alt`)}
        sizes={sizes ?? (feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw")}
        className="absolute inset-0 h-full"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/20" />
      <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
        {s.favorite ? <FavoriteBadge /> : <span />}
        <SaveButton kind="stay" id={s.id} name={name} />
      </div>
      <div className={cn("absolute inset-x-0 bottom-0", feature ? "p-6 sm:p-8" : "p-5")}>
        <p className="eyebrow text-white/75">{t(`${s.id}.area`)}</p>
        <h3 className={cn("mt-2", feature ? "text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-[0.95]" : "t-h3")}>
          <Link href={`/enquire?stay=${s.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
            {name}
          </Link>
        </h3>
        {feature && <p className="mt-3 hidden max-w-[48ch] text-white/80 sm:block">{t(`${s.id}.blurb`)}</p>}
        <Rating score={s.rating} count={s.reviews} tone="onDark" className="mt-3" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-sm text-[#0e0e10]">
            <span className="num font-semibold">{price(s.pricePerNight)}</span>
            <span className="ml-1 text-[#55555c]">{tc("perNight")} · {tc("taxesIncluded")}</span>
          </p>
          {s.freeCancellation && (
            <p className="inline-flex h-9 items-center gap-1 rounded-full bg-black/40 px-3 text-sm backdrop-blur-md">
              <Check size={14} strokeWidth={2} aria-hidden /> {tc("freeCancellation")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
