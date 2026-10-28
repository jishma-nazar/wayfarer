import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { alternatesFor } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { SavedList } from "@/components/pages/SavedList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("saved");
  return { title: t("title"), alternates: alternatesFor(await rootLocale(), "/saved"), robots: { index: false } };
}

export default async function Page() {
  const t = await getTranslations("saved");
  return (
    <>
      <PageHeader title={t("title")} dek={t("dek")} />
      <SavedList />
    </>
  );
}
