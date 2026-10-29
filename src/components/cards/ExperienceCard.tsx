import { Check, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Experience } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { FavoriteBadge } from "@/components/ui/FavoriteBadge";
import { usePrice } from "@/components/ui/Price";

export function ExperienceCard({ e, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" }: { e: Experience; sizes?: string }) {
  const t = useTranslations("content.experiences");
  const tc = useTranslations("card");
  const price = usePrice();
  const title = t(`${e.id}.title`);
  const duration = e.hours >= 24 ? tc("days", { count: Math.round(e.hours / 24) }) : tc("hours", { count: e.hours });

  return (
    <article className="group relative isolate aspect-[4/5] overflow-hidden rounded-[24px] bg-paper-2 text-white">
      <Photo
        photo={e.photo}
        alt={t(`${e.id}.alt`)}
        sizes={sizes}
        className="absolute inset-0 h-full"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
      <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
        {e.favorite ? <FavoriteBadge /> : <span />}
        <SaveButton kind="experience" id={e.id} name={title} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="flex items-center gap-2 text-sm text-white/80">
          {t(`${e.id}.area`)}
          <span aria-hidden>·</span>
          <span className="num inline-flex items-center gap-1"><Clock size={13} strokeWidth={1.75} aria-hidden />{duration}</span>
        </p>
        <h3 className="t-h3 mt-2">
          <Link href={`/enquire?experience=${e.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
            {title}
          </Link>
        </h3>
        <Rating score={e.rating} count={e.reviews} tone="onDark" className="mt-2.5" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-sm text-[#0e0e10]">
            <span className="text-[#55555c]">{tc("from")}&nbsp;</span>
            <span className="num font-semibold">{price(e.price)}</span>
            <span className="text-[#55555c]">&nbsp;{tc("perPerson")}</span>
          </p>
          {e.freeCancellation && (
            <p className="inline-flex h-9 items-center gap-1 rounded-full bg-black/40 px-3 text-sm backdrop-blur-md">
              <Check size={14} strokeWidth={2} aria-hidden /> {tc("freeCancellation")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
