import { ArrowRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { articles } from "@/lib/data";
import { Photo } from "@/components/ui/Photo";

/** Table-of-contents layout, like the front of a magazine. */
export function JournalTeaser() {
  const t = useTranslations("home.journal");
  const ta = useTranslations("content.articles");
  const format = useFormatter();

  return (
    <section aria-labelledby="journal-title" className="border-t border-hairline bg-paper-2 section-y">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
            <h2 id="journal-title" className="t-h1 mt-3">{t("title")}</h2>
            <Link href="/journal" className="btn btn-ghost mt-6">
              {t("cta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </div>
        <ol className="border-t border-ink lg:col-span-8">
          {articles.slice(0, 3).map((a, i) => (
            <li key={a.id} className="border-b border-hairline">
              <article className="group relative grid grid-cols-[1fr_7rem] gap-5 py-7 sm:grid-cols-[2.5rem_1fr_12rem] sm:gap-6">
                <span className="num hidden font-mono text-sm text-ink-faint sm:block">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="eyebrow text-ink-muted">
                    {ta(`${a.id}.category`)} · <span className="num">{t("readTime", { minutes: a.readMinutes })}</span>
                  </p>
                  <h3 className="t-h3 mt-2">
                    <Link href={`/journal/${a.id}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent-strong focus-visible:outline-none">
                      {ta(`${a.id}.title`)}
                    </Link>
                  </h3>
                  <p className="mt-2 hidden max-w-[52ch] text-ink-muted sm:block">{ta(`${a.id}.dek`)}</p>
                  <p className="mt-3 text-xs text-ink-faint">
                    <time dateTime={a.date}>{format.dateTime(new Date(`${a.date}T12:00:00Z`), { dateStyle: "long", timeZone: "UTC" })}</time>
                  </p>
                </div>
                <Photo photo={a.photo} alt={ta(`${a.id}.alt`)} sizes="(min-width: 640px) 192px, 112px" className="aspect-[4/5] rounded-sm sm:aspect-[4/3]" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
