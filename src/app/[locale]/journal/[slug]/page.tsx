import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { articles, photoUrl } from "@/lib/data";
import { alternatesFor } from "@/lib/seo";
import { Photo } from "@/components/ui/Photo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.id === slug);
  if (!a) return {};
  const t = await getTranslations("content.articles");
  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.dek`),
    alternates: alternatesFor(await rootLocale(), `/journal/${slug}`),
    openGraph: { type: "article", publishedTime: a.date, images: [`${photoUrl(a.photo)}?auto=format&fit=crop&w=1200&h=630&q=70`] },
  };
}

// Reading `params` happens inside Suspense so client navigations between articles stay instant;
// every slug is generated at build time, so the static HTML still carries the full article.
export default function ArticlePage({ params }: PageProps<"/[locale]/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x min-h-[80svh]" aria-busy="true" />}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.id === slug);
  if (!a) notFound();
  const t = await getTranslations("content.articles");
  const tj = await getTranslations("journalArticle");
  const th = await getTranslations("home.journal");
  const format = await getFormatter();
  const body = t.raw(`${slug}.body`) as string[];
  const date = format.dateTime(new Date(`${a.date}T12:00:00Z`), { dateStyle: "long", timeZone: "UTC" });

  return (
    <article className="pb-24">
      <header className="container-x pt-8 md:pt-12">
        <Link href="/journal" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold link-underline">
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> {tj("back")}
        </Link>
        <p className="eyebrow mt-8 text-accent-strong">{t(`${slug}.category`)} · {th("readTime", { minutes: a.readMinutes })}</p>
        <h1 className="t-h1 mt-3 max-w-[20ch]">{t(`${slug}.title`)}</h1>
        <p className="t-lead mt-5 max-w-[56ch] text-ink-muted">{t(`${slug}.dek`)}</p>
        <p className="mt-4 text-sm text-ink-faint"><time dateTime={a.date}>{tj("published", { date })}</time></p>
      </header>
      <figure className="mt-10">
        <Photo photo={a.photo} alt={t(`${slug}.alt`)} sizes="100vw" preload className="aspect-[16/9] max-h-[78svh] w-full" />
        <figcaption className="container-x mt-3 text-sm text-ink-muted">{t(`${slug}.alt`)}</figcaption>
      </figure>
      <div className="container-x mt-12 grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 text-[1.1875rem] leading-[1.7] lg:col-span-7 lg:col-start-2">
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[4.25rem] first-letter:leading-[0.85] first-letter:text-accent" : undefined}>
              {p}
            </p>
          ))}
        </div>
        <aside className="lg:col-span-3 lg:col-start-10">
          <div className="border-t border-ink pt-5">
            <p className="font-display text-xl">{tj("related")}</p>
            <p className="mt-2 text-sm text-ink-muted">{tj("relatedBody")}</p>
            <Link href="/enquire" className="btn btn-primary mt-5">
              {tj("related")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
