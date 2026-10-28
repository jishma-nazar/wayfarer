import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whyPhoto } from "@/lib/data";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

/** Split editorial block: a photo that bleeds off the left edge, four numbered promises. */
export function WhyUs() {
  const t = useTranslations("home.why");
  const promises = t.raw("promises") as { title: string; body: string }[];

  return (
    <section aria-labelledby="why-title" className="section-y border-t border-hairline">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-0">
        <figure className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:pr-16">
          <Reveal from="left">
            <Photo photo={whyPhoto} alt={t("photoCaption")} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5] max-h-[78svh] w-full lg:aspect-auto lg:h-[78svh]" />
          </Reveal>
          <figcaption className="container-x mt-3 text-sm text-ink-muted lg:ml-auto lg:mr-0 lg:max-w-none lg:px-0 lg:text-right">
            {t("photoCaption")}
          </figcaption>
        </figure>

        <div className="container-x lg:ml-0 lg:max-w-[calc(var(--max)/2)] lg:pl-0 lg:pt-6">
          <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
          <h2 id="why-title" className="t-h1 mt-3 max-w-[14ch]">{t("title")}</h2>
          <ol className="mt-10 border-t border-hairline">
            {promises.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-hairline py-7 sm:grid-cols-[5rem_1fr]">
                <span className="num font-display text-[2.5rem] leading-none text-accent" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-ink-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/enquire" className="btn btn-primary mt-10">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
