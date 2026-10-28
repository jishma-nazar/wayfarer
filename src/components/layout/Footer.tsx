import { ArrowUpRight, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { contact } from "@/lib/data";
import { Wordmark } from "@/components/ui/Wordmark";
import { ThemeSegmented } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NAV_ITEMS } from "./nav";
import { CurrentYear } from "./CurrentYear";

const PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "UPI"];
const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const ta = useTranslations("a11y");
  const tt = useTranslations("theme");
  const tl = useTranslations("language");

  const cols = [
    { title: t("explore"), links: NAV_ITEMS.map((n) => ({ label: tn(n.key), href: n.href })) },
    {
      title: t("help"),
      links: [
        { label: t("faq"), href: "/#faq" },
        { label: t("cancellation"), href: "/#cancellation" },
        { label: t("contactLink"), href: "/enquire" },
        { label: t("savedLink"), href: "/saved" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/journal" },
        { label: t("careers"), href: "/journal" },
        { label: t("press"), href: "/journal" },
        { label: t("accessibility"), href: "/journal" },
      ],
    },
  ];

  return (
    <footer className="border-t border-hairline bg-paper-2 pt-16 text-ink lg:pt-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label={ta("footerNav")} className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {cols.map((col) => (
              <div key={col.title}>
                <h2 className="eyebrow mb-4 text-ink-muted" style={{ fontFamily: "var(--type-ui)" }}>{col.title}</h2>
                <ul className="space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="inline-flex min-h-10 items-center text-[0.9375rem] hover:text-accent-strong">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-[1fr_1.25fr]">
            <address className="not-italic">
              <h2 className="eyebrow mb-4 text-ink-muted" style={{ fontFamily: "var(--type-ui)" }}>{t("contact")}</h2>
              <dl className="space-y-3 text-[0.9375rem]">
                <div>
                  <dt className="text-xs text-ink-muted">{t("phone")}</dt>
                  <dd><a className="num link-underline" href={contact.phoneHref}>{contact.phone}</a></dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">{t("whatsapp")}</dt>
                  <dd>
                    <a className="link-underline inline-flex items-center gap-1" href={contact.whatsapp} target="_blank" rel="noreferrer">
                      wa.me/351910000128 <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                      <span className="sr-only">{ta("opensNewTab")}</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">{t("email")}</dt>
                  <dd><a className="link-underline break-all" href={`mailto:${contact.email}`}>{contact.email}</a></dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">{t("office")}</dt>
                  <dd>{t("address")}</dd>
                  <dd className="text-ink-muted">{t("hours")}</dd>
                </div>
              </dl>
            </address>
            <div className="space-y-8">
              <section aria-labelledby="footer-prefs">
                <h2 id="footer-prefs" className="eyebrow mb-4 text-ink-muted" style={{ fontFamily: "var(--type-ui)" }}>{t("preferences")}</h2>
                <p className="sr-only">{tt("label")}</p>
                <ThemeSegmented className="w-full" />
                <p className="sr-only">{tl("label")}</p>
                <LanguageSwitcher className="mt-3 -ml-1.5" />
              </section>
              <section aria-labelledby="footer-social">
                <h2 id="footer-social" className="eyebrow mb-3 text-ink-muted" style={{ fontFamily: "var(--type-ui)" }}>{t("social")}</h2>
                <ul className="flex flex-wrap gap-x-4">
                  {SOCIAL.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 text-[0.9375rem] link-underline">
                        {s.label} <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                        <span className="sr-only">{ta("opensNewTab")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-hairline pt-8">
          <p className="max-w-md text-ink-muted">{t("tagline")}</p>
          <Wordmark size="xl" className="mt-4 -ml-[0.04em] block select-none" />
        </div>

        <div className="flex flex-col gap-6 border-t border-hairline py-8 text-sm xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
            <span className="shrink-0 text-ink-muted">{t("payments")}</span>
            <ul aria-label={t("paymentsLabel")} className="flex flex-wrap gap-1.5">
              {PAYMENTS.map((p) => (
                <li key={p} className="rounded-sm border border-hairline-strong px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-muted">
                  {p}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <Lock size={14} strokeWidth={1.5} aria-hidden /> {t("secure")}
            </span>
          </div>
          <div className="flex flex-col gap-2 text-ink-muted sm:flex-row sm:items-center sm:gap-5">
            <p>{t.rich("legal", { year: () => <CurrentYear /> })}</p>
            <ul className="flex gap-4">
              <li><Link href="/journal" className="link-underline">{t("privacy")}</Link></li>
              <li><Link href="/journal" className="link-underline">{t("terms")}</Link></li>
              <li><Link href="/journal" className="link-underline">{t("cookies")}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
