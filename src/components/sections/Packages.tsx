import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { packages } from "@/lib/data";
import { BoardingPassCard } from "@/components/cards/BoardingPassCard";
import { SectionHead } from "./SectionHead";

export function Packages() {
  const t = useTranslations("home.packages");
  return (
    <section aria-labelledby="packages-title" className="bg-olive-band text-on-olive section-y">
      <div className="container-x">
        <SectionHead
          id="packages-title"
          tone="onOlive"
          eyebrow={t("eyebrow")}
          title={t("title")}
          dek={t("dek")}
          action={
            <Link href="/packages" className="btn border border-on-olive/40 text-on-olive hover:border-on-olive">
              {t("cta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          }
        />
        <ul role="list" className="mt-12 grid gap-8 xl:grid-cols-2">
          {packages.map((p, i) => (
            <li key={p.id} className={i % 2 === 1 ? "xl:translate-y-10" : undefined}>
              <BoardingPassCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
