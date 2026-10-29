import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { stays } from "@/lib/data";
import { StayCard } from "@/components/cards/StayCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "./SectionHead";

/** Bento grid: one big feature stay and four tiles, all full-bleed photography. */
export function EditorsPicks() {
  const t = useTranslations("home.picks");
  const [feature, ...rest] = stays.filter((s) => s.editorsPick);

  return (
    <section aria-labelledby="picks-title" className="container-x section-y">
      <SectionHead
        id="picks-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        dek={t("dek")}
        action={
          <Link href="/stays" className="btn btn-ink">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        }
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:h-[min(92vh,880px)] lg:grid-cols-4 lg:grid-rows-2">
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <StayCard s={feature} feature fill className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </Reveal>
        {rest.map((s, i) => (
          <Reveal key={s.id} delay={i * 90} className="lg:h-full">
            <StayCard s={s} fill className="lg:h-full lg:min-h-0" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
