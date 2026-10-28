import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { stays } from "@/lib/data";
import { StayCard } from "@/components/cards/StayCard";

export function EditorsPicks() {
  const t = useTranslations("home.picks");
  const picks = stays.filter((s) => s.editorsPick);
  const [feature, ...rest] = picks;

  return (
    <section aria-labelledby="picks-title" className="container-x section-y">
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
          <h2 id="picks-title" className="t-h1 mt-3 max-w-[16ch]">{t("title")}</h2>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-ink-muted">{t("dek")}</p>
          <Link href="/stays" className="btn btn-ghost mt-4">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-2 lg:col-span-6 lg:row-span-2">
          <p className="eyebrow mb-3 text-ink-muted">{t("featureLabel")}</p>
          <StayCard s={feature} feature />
        </div>
        {rest.map((s, i) => (
          <StayCard key={s.id} s={s} className={i % 2 === 0 ? "lg:col-span-3" : "lg:col-span-3 lg:mt-14"} />
        ))}
      </div>
    </section>
  );
}
