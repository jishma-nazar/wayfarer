import { useTranslations } from "next-intl";
import { packages } from "@/lib/data";
import { PackageCard } from "@/components/cards/PackageCard";
import { PackagesScroller } from "./PackagesScroller";

export function Packages() {
  const t = useTranslations("home.packages");
  return (
    <section aria-labelledby="packages-title" className="theme-dark">
      <PackagesScroller
        eyebrow={t("eyebrow")}
        title={t("title")}
        dek={t("dek")}
        cta={t("cta")}
        hint={t("scrollHint")}
        cards={packages.map((p) => (
          <PackageCard key={p.id} p={p} className="h-full w-full" />
        ))}
      />
    </section>
  );
}
