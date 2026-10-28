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
          <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
          <h2 id="faq-title" className="t-h1 mt-3">{t("title")}</h2>
        </div>
        <div className="lg:col-span-8">
          <div className="border-t border-ink">
            {items.map((item, i) => (
              <details key={item.q} id={i === 0 ? "cancellation" : undefined} className="group border-b border-hairline" open={i === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-[1.375rem] leading-snug">{item.q}</span>
                  <Plus size={20} strokeWidth={1.5} aria-hidden className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
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
