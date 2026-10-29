"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Heart, Luggage, UserRound, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { contact } from "@/lib/data";
import { Wordmark } from "@/components/ui/Wordmark";
import { ThemeSegmented } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NAV_ITEMS } from "./nav";

/** Full-screen editorial menu: big serif links, then preferences and a way to reach a person. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("nav");
  const tt = useTranslations("theme");
  const tl = useTranslations("language");
  const ta = useTranslations("auth");
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useScrollLock(open);
  useFocusTrap(ref, open, onClose);

  // Close when navigation happens (including back/forward).
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-paper text-ink"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35 }}
        >
          <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-hairline">
            <Link href="/" onClick={onClose} className="-ml-1 rounded-sm px-1 py-2">
              <Wordmark />
            </Link>
            <button type="button" onClick={onClose} data-autofocus className="inline-flex min-h-11 items-center gap-2 rounded-sm px-2.5 text-sm font-semibold hover:bg-paper-2">
              <X size={20} strokeWidth={1.5} aria-hidden />
              <span>{t("closeMenu")}</span>
            </button>
          </div>

          <div className="container-x flex flex-1 flex-col gap-10 py-8 md:flex-row md:gap-16 md:py-12">
            <nav aria-label={t("menu")} className="md:flex-[1.4]">
              <ol className="divide-y divide-hairline border-y border-hairline">
                {NAV_ITEMS.map((item, i) => (
                  <m.li
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.35 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-4 aria-[current=page]:text-accent-strong"
                    >
                      <span className="num font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-[clamp(2.25rem,9vw,3.75rem)] leading-none tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1.5">
                        {t(item.key)}
                      </span>
                    </Link>
                  </m.li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/sign-in" onClick={onClose} className="btn btn-ink">
                  <UserRound size={16} strokeWidth={1.5} aria-hidden />
                  {ta("account")}
                </Link>
                <Link href="/saved" onClick={onClose} className="btn btn-ghost">
                  <Heart size={16} strokeWidth={1.5} aria-hidden />
                  {t("saved")}
                </Link>
                <Link href="/trips" onClick={onClose} className="btn btn-ghost">
                  <Luggage size={16} strokeWidth={1.5} aria-hidden />
                  {t("trips")}
                </Link>
              </div>
            </nav>

            <div className="flex flex-col gap-8 md:flex-1 md:pt-2">
              <Link href="/enquire" onClick={onClose} className="btn btn-primary w-full text-base md:w-auto md:self-start">
                {t("planTrip")}
              </Link>
              <section aria-labelledby="menu-prefs" className="space-y-4">
                <h2 id="menu-prefs" className="eyebrow text-ink-muted" style={{ fontFamily: "var(--type-ui)" }}>
                  {t("menuPreferences")}
                </h2>
                <div>
                  <p className="mb-2 text-sm text-ink-muted">{tt("label")}</p>
                  <ThemeSegmented className="w-full max-w-sm" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-ink-muted">{tl("label")}</p>
                  <LanguageSwitcher size="lg" className="-ml-1.5" />
                </div>
              </section>
              <div className="border-t border-hairline pt-6 text-sm">
                <p className="mb-3 text-ink-muted">{t("menuHelp")}</p>
                <ul className="space-y-1">
                  <li>
                    <a href={contact.whatsapp} className="inline-flex min-h-11 items-center gap-1 font-semibold link-underline" target="_blank" rel="noreferrer">
                      WhatsApp <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                    </a>
                  </li>
                  <li>
                    <a href={contact.phoneHref} className="num inline-flex min-h-11 items-center font-semibold link-underline">
                      {contact.phone}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
