import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { alternatesFor } from "@/lib/seo";
import { Results } from "@/components/results/Results";
import { ResultsFallback } from "@/components/results/ResultsFallback";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("results");
  // Result pages are thin duplicates of category pages — keep them out of the index.
  return { title: t("title"), alternates: alternatesFor(await rootLocale(), "/search"), robots: { index: false, follow: true } };
}

export default async function SearchPage() {
  const t = await getTranslations("results");
  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>
      <Suspense fallback={<ResultsFallback />}>
        <Results />
      </Suspense>
    </>
  );
}
