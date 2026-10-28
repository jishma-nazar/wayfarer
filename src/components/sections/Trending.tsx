import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { destinations } from "@/lib/data";
import { Carousel } from "@/components/ui/Carousel";
import { DestinationCard } from "@/components/cards/DestinationCard";

export function Trending() {
  const t = useTranslations("home.trending");
  const items = destinations.filter((d) => d.trending);

  return (
    <section aria-labelledby="trending-title" className="pt-[var(--section-y)]">
      <Carousel
        label={t("region")}
        prevLabel={t("prev")}
        nextLabel={t("next")}
        itemClassName="w-[72vw] max-w-[320px] sm:w-[42vw] md:w-[30vw] lg:w-[23vw]"
        header={
          <div>
            <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
            <h2 id="trending-title" className="t-h1 mt-3 max-w-[18ch]">{t("title")}</h2>
          </div>
        }
        action={
          <Link href="/destinations" className="inline-flex min-h-11 items-center gap-2 font-semibold link-underline">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
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
