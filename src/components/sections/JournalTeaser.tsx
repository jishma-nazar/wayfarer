import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { articles } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "./SectionHead";

export function JournalTeaser() {
  const t = useTranslations("home.journal");
  const ta = useTranslations("content.articles");
  const format = useFormatter();
  const [lead, ...rest] = articles.slice(0, 3);

  const card = (a: (typeof articles)[number], big: boolean) => (
    <article className={cn("group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[24px] bg-paper-2 p-6 text-white", big ? "min-h-[480px] lg:p-8" : "min-h-[300px]")}>
      <Photo photo={a.photo} alt={ta(`${a.id}.alt`)} sizes={big ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} className="absolute inset-0 -z-10 h-full" imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <span aria-hidden className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white text-[#0e0e10] transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight size={18} strokeWidth={1.75} />
      </span>
      <p className="eyebrow text-white/80">
        {ta(`${a.id}.category`)} · <span className="num">{t("readTime", { minutes: a.readMinutes })}</span>
      </p>
      <h3 className={cn("mt-3", big ? "text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] leading-[0.95]" : "t-h3")}>
        <Link href={`/journal/${a.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
          {ta(`${a.id}.title`)}
        </Link>
      </h3>
      {big && <p className="mt-3 max-w-[50ch] text-white/80">{ta(`${a.id}.dek`)}</p>}
      <p className="mt-4 text-xs text-white/65">
        <time dateTime={a.date}>{format.dateTime(new Date(`${a.date}T12:00:00Z`), { dateStyle: "long", timeZone: "UTC" })}</time>
      </p>
    </article>
  );

  return (
    <section aria-labelledby="journal-title" className="container-x section-y">
      <SectionHead
        id="journal-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        action={
          <Link href="/journal" className="btn btn-ghost">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        }
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">{card(lead, true)}</Reveal>
        <div className="grid gap-4 lg:col-span-5">
          {rest.map((a, i) => (
            <Reveal key={a.id} delay={(i + 1) * 100}>{card(a, false)}</Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
