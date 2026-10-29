import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { alternatesFor } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiryFlow } from "@/components/pages/EnquiryFlow";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("enquire");
  return { title: t("title"), description: t("dek"), alternates: alternatesFor(await rootLocale(), "/enquire") };
}

export default async function EnquirePage() {
  const t = await getTranslations("enquire");
  return (
    <>
      <PageHeader title={t("title")} dek={t("dek")} photo={{ id: "1583844056361-4418a8f2a985" }} />
      <Suspense fallback={<div className="container-x min-h-[60vh]" aria-busy="true" />}>
        <EnquiryFlow />
      </Suspense>
    </>
  );
}
