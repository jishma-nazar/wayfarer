import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { articles } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/destinations", "/stays", "/experiences", "/packages", "/journal", "/enquire", ...articles.map((a) => `/journal/${a.id}`)];
  return paths.map((path) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
  }));
}
