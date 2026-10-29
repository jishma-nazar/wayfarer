import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { display, mono, sans } from "../fonts";
import "../globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpButton } from "@/components/layout/HelpButton";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";
import { routing } from "@/i18n/routing";
import { SITE_URL, alternatesFor } from "@/lib/seo";

/**
 * Namespaces Client Components read. Everything else (page copy rendered on the server, article
 * bodies, metadata) stays out of the client payload.
 */
const CLIENT_NAMESPACES = [
  "a11y", "nav", "theme", "language", "moods", "search", "card", "validation", "results", "saved", "trips",
  "enquire", "help", "home.hero", "home.stats", "home.moods", "home.packages", "home.map", "home.stories", "home.newsletter",
  "content.destinations", "content.stays", "content.experiences", "content.packages", "content.stories", "content.gallery",
];

function pick(messages: Record<string, unknown>, paths: string[]) {
  const out: Record<string, unknown> = {};
  for (const path of paths) {
    const keys = path.split(".");
    let src: unknown = messages;
    let dst = out;
    keys.forEach((k, i) => {
      src = (src as Record<string, unknown> | undefined)?.[k];
      if (i === keys.length - 1) dst[k] = src;
      else dst = (dst[k] ??= {}) as Record<string, unknown>;
    });
  }
  return out;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("siteName")}` },
    description: t("description"),
    alternates: alternatesFor(locale),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: t("ogLocale"),
      images: [{ url: "https://images.unsplash.com/photo-1638664370752-8188076afbab?auto=format&fit=crop&w=1200&h=630&q=70", width: 1200, height: 630 }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
  ],
  colorScheme: "light dark",
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("a11y");
  const messages = pick(await getMessages(), CLIENT_NAMESPACES);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-dvh">
        <NextIntlClientProvider messages={messages as never}>
          <Providers>
            <a
              href="#main"
              className="sr-only-focusable btn btn-ink fixed left-4 top-3 z-[90]"
            >
              {t("skip")}
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <HelpButton />
            <BottomNav />
            <ScrollRestorer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
