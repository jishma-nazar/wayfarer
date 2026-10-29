import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

/** Native <details> accordion: keyboard and screen-reader support for free, works without JS. */
export function Faq() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <section id="faq" aria-labelledby="faq-title" className="container-x section-y">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow inline-flex items-center gap-2 text-accent-strong">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {t("eyebrow")}
          </p>
          <h2 id="faq-title" className="t-h1 mt-4">{t("title")}</h2>
        </div>
        <div className="lg:col-span-8">
          <div className="space-y-3">
            {items.map((item, i) => (
              <details key={item.q} id={i === 0 ? "cancellation" : undefined} className="group rounded-[22px] bg-paper-2 px-6 transition-colors open:bg-surface open:shadow-float" open={i === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]">{item.q}</span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-open:rotate-45"><Plus size={18} strokeWidth={2} aria-hidden /></span>
                </summary>
                <p className="max-w-[62ch] pb-6 pr-10 text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
