import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { alternatesFor } from "@/lib/seo";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signIn");
  return { title: t("metaTitle"), alternates: alternatesFor(await rootLocale(), "/sign-in"), robots: { index: false } };
}

export default function Page() {
  return (
    <AuthShell>
      <AuthForm mode="signIn" />
    </AuthShell>
  );
}
