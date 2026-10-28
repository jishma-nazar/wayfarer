import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { alternatesFor } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Results } from "@/components/results/Results";
import { ResultsFallback } from "@/components/results/ResultsFallback";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.stays");
  return { title: t("title"), description: t("dek"), alternates: alternatesFor(await rootLocale(), "/stays") };
}

export default async function Page() {
  const t = await getTranslations("pages.stays");
  return (
    <>
      <PageHeader title={t("title")} dek={t("dek")} />
      <Suspense fallback={<ResultsFallback />}>
        <Results fixedKind="stay" />
      </Suspense>
    </>
  );
}
