import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { alternatesFor } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { TripsList } from "@/components/pages/TripsList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("trips");
  return { title: t("title"), alternates: alternatesFor(await rootLocale(), "/trips"), robots: { index: false } };
}

export default async function Page() {
  const t = await getTranslations("trips");
  return (
    <>
      <PageHeader title={t("title")} dek={t("dek")} />
      <TripsList />
    </>
  );
}
