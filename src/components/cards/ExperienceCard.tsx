import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Experience } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { PassportStamp } from "@/components/ui/PassportStamp";
import { usePrice } from "@/components/ui/Price";

export function ExperienceCard({ e, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" }: { e: Experience; sizes?: string }) {
  const t = useTranslations("content.experiences");
  const tc = useTranslations("card");
  const price = usePrice();
  const title = t(`${e.id}.title`);
  const duration = e.hours >= 24 ? tc("days", { count: Math.round(e.hours / 24) }) : tc("hours", { count: e.hours });

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <Photo
          photo={e.photo}
          alt={t(`${e.id}.alt`)}
          sizes={sizes}
          className="aspect-[3/2] rounded-sm"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <SaveButton kind="experience" id={e.id} name={title} className="absolute right-3 top-3 z-10" />
        {e.favorite && <PassportStamp className="absolute -bottom-5 right-4 z-10" size={64} />}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-sm text-ink-muted">
          {t(`${e.id}.area`)} · <span className="num">{duration}</span>
        </p>
        <h3 className="t-h3 mt-1 pr-14">
          <Link href={`/enquire?experience=${e.id}`} className="after:absolute after:inset-0 after:content-[''] hover:text-accent-strong focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <Rating score={e.rating} count={e.reviews} className="mt-2.5" />
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-3">
          <p className="text-sm">
            <span className="text-ink-muted">{tc("from")} </span>
            <span className="num text-lg font-semibold">{price(e.price)}</span>
            <span className="text-ink-muted"> {tc("perPerson")}</span>
          </p>
          {e.freeCancellation && (
            <p className="inline-flex items-center gap-1 text-sm font-medium text-olive">
              <Check size={15} strokeWidth={1.5} aria-hidden /> {tc("freeCancellation")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
