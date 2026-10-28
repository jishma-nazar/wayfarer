import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// Explicit override first, then the project's production domain that Vercel injects at build time.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://wayfarer.example");

/** Canonical + hreflang alternates for a locale-less path like "/stays". */
export function alternatesFor(locale: string, path = ""): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${clean}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${clean}`])),
      "x-default": `/${routing.defaultLocale}${clean}`,
    },
  };
}
