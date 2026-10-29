import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Link } from "@/i18n/navigation";
import { articles } from "@/lib/data";
import { alternatesFor } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Photo } from "@/components/ui/Photo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.journal");
  return { title: t("title"), description: t("dek"), alternates: alternatesFor(await rootLocale(), "/journal") };
}

export default async function JournalPage() {
  const t = await getTranslations("pages.journal");
  const ta = await getTranslations("content.articles");
  const th = await getTranslations("home.journal");
  const format = await getFormatter();
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHeader title={t("title")} dek={t("dek")} photo={{ id: "1500043357865-c6b8827edf10" }} />
      <div className="container-x pb-24">
        <article className="group relative mt-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <Photo photo={lead.photo} alt={ta(`${lead.id}.alt`)} sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[3/2] rounded-[24px] lg:col-span-7" />
          <div className="lg:col-span-5 lg:pt-4">
            <p className="eyebrow text-accent-strong">{ta(`${lead.id}.category`)} · {th("readTime", { minutes: lead.readMinutes })}</p>
            <h2 className="t-h1 mt-3">
              <Link href={`/journal/${lead.id}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent-strong">{ta(`${lead.id}.title`)}</Link>
            </h2>
            <p className="t-lead mt-4 text-ink-muted">{ta(`${lead.id}.dek`)}</p>
            <p className="mt-4 text-sm text-ink-faint"><time dateTime={lead.date}>{format.dateTime(new Date(`${lead.date}T12:00:00Z`), { dateStyle: "long", timeZone: "UTC" })}</time></p>
          </div>
        </article>
        <ul role="list" className="mt-16 grid gap-x-8 gap-y-14 border-t border-hairline pt-10 md:grid-cols-3">
          {rest.map((a) => (
            <li key={a.id}>
              <article className="group relative">
                <Photo photo={a.photo} alt={ta(`${a.id}.alt`)} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[4/3] rounded-[24px]" />
                <p className="eyebrow mt-4 text-ink-muted">{ta(`${a.id}.category`)} · {th("readTime", { minutes: a.readMinutes })}</p>
                <h2 className="t-h3 mt-2">
                  <Link href={`/journal/${a.id}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent-strong">{ta(`${a.id}.title`)}</Link>
                </h2>
                <p className="mt-2 text-ink-muted">{ta(`${a.id}.dek`)}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
