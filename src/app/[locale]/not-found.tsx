import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFoundPhoto } from "@/lib/data";
import { POPULAR_DESTINATIONS } from "@/lib/search";
import { Photo } from "@/components/ui/Photo";
import { SearchModule } from "@/components/search/SearchModule";

export default function NotFound() {
  const t = useTranslations("notFound");
  const tn = useTranslations("nav");
  const td = useTranslations("content.destinations");

  return (
    <div className="container-x grid gap-12 py-12 md:py-20 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-7">
        <p className="eyebrow font-mono text-accent-strong">{t("eyebrow")}</p>
        <h1 className="t-display mt-4 max-w-[12ch]">{t("title")}</h1>
        <p className="t-lead mt-6 max-w-[52ch] text-ink-muted">{t("body")}</p>
        <div className="mt-8 rounded-lg border border-hairline bg-surface p-4 md:p-6">
          <SearchModule variant="page" />
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {POPULAR_DESTINATIONS.map((id) => (
            <li key={id}>
              <Link href={`/search?q=${encodeURIComponent(td(`${id}.name`))}`} className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong px-4 text-sm font-medium hover:border-ink">
                {td(`${id}.name`)}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/packages" className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong px-4 text-sm font-medium hover:border-ink">{tn("packages")}</Link>
          </li>
        </ul>
        <Link href="/" className="btn btn-primary mt-10">
          {t("home")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
      <figure className="lg:col-span-5">
        <Photo photo={notFoundPhoto} alt={t("photoCaption")} sizes="(min-width: 1024px) 38vw, 100vw" preload className="aspect-[4/5] rounded-sm" />
        <figcaption className="mt-3 text-sm text-ink-muted">{t("photoCaption")}</figcaption>
      </figure>
    </div>
  );
}
