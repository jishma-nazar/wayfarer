import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Stay } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { PassportStamp } from "@/components/ui/PassportStamp";
import { usePrice } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";

export function StayCard({ s, feature, sizes, className }: { s: Stay; feature?: boolean; sizes?: string; className?: string }) {
  const t = useTranslations("content.stays");
  const tc = useTranslations("card");
  const price = usePrice();
  const name = t(`${s.id}.name`);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative">
        <Reveal className="overflow-hidden rounded-sm">
          <Photo
            photo={s.photo}
            alt={t(`${s.id}.alt`)}
            sizes={sizes ?? (feature ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw")}
            className={feature ? "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/3]"}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Reveal>
        <SaveButton kind="stay" id={s.id} name={name} className="absolute right-3 top-3 z-10" />
        {s.favorite && <PassportStamp className="absolute -bottom-6 left-3 z-10" size={feature ? 92 : 72} />}
      </div>

      <div className={cn("flex flex-1 flex-col", s.favorite ? "mt-8" : "mt-4")}>
        <p className="eyebrow text-ink-muted">{t(`${s.id}.area`)}</p>
        <h3 className={cn("mt-1.5", feature ? "t-h2" : "t-h3")}>
          <Link href={`/enquire?stay=${s.id}`} className="after:absolute after:inset-0 after:content-[''] hover:text-accent-strong focus-visible:outline-none">
            {name}
          </Link>
        </h3>
        {feature && <p className="t-lead mt-3 max-w-[52ch] text-ink-muted">{t(`${s.id}.blurb`)}</p>}
        <Rating score={s.rating} count={s.reviews} className="mt-3" />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-4">
          <p>
            <span className={cn("num font-semibold", feature ? "text-2xl" : "text-xl")}>{price(s.pricePerNight)}</span>{" "}
            <span className="text-sm text-ink-muted">
              {tc("perNight")} · {tc("taxesIncluded")}
            </span>
          </p>
          {s.freeCancellation && (
            <p className="inline-flex items-center gap-1 text-sm font-medium text-olive">
              <Check size={15} strokeWidth={1.5} aria-hidden /> {tc("freeCancellation")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
