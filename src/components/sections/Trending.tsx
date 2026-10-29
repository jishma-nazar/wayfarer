import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { destinations } from "@/lib/data";
import { Carousel } from "@/components/ui/Carousel";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { Reveal } from "@/components/ui/Reveal";

export function Trending() {
  const t = useTranslations("home.trending");
  const items = destinations.filter((d) => d.trending);

  return (
    <section aria-labelledby="trending-title" className="pt-[var(--section-y)]">
      <Carousel
        label={t("region")}
        prevLabel={t("prev")}
        nextLabel={t("next")}
        itemClassName="w-[78vw] max-w-[380px] sm:w-[44vw] md:w-[34vw] lg:w-[26vw]"
        header={
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-2 text-accent-strong">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {t("eyebrow")}
            </p>
            <h2 id="trending-title" className="t-h1 mt-4 max-w-[14ch]">{t("title")}</h2>
          </Reveal>
        }
        action={
          <Link href="/destinations" className="btn btn-ghost">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        }
      >
        {items.map((d) => (
          <DestinationCard key={d.id} d={d} />
        ))}
      </Carousel>
    </section>
  );
}
