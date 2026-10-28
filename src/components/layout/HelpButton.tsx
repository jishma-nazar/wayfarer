"use client";

import { AnimatePresence, m } from "framer-motion";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { contact } from "@/lib/data";
import { useFocusTrap, useMediaQuery, useOnClickOutside, useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/cn";

export function HelpButton() {
  const t = useTranslations("help");
  const ta = useTranslations("a11y");
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // On phones the first screen is the search card — don't cover it; appear once the visitor scrolls.
  const desktop = useMediaQuery("(min-width: 1024px)", false);
  const scrolled = useScrolled(240);
  const shown = desktop || scrolled || open;
  useOnClickOutside(wrap, () => setOpen(false), open);
  useFocusTrap(panel, open, () => setOpen(false));

  const actions = [
    { href: contact.whatsapp, label: t("whatsapp"), Icon: MessageCircle, external: true },
    { href: contact.phoneHref, label: t("call", { phone: contact.phone }), Icon: Phone },
    { href: `mailto:${contact.email}`, label: t("email", { email: contact.email }), Icon: Mail },
  ];

  return (
    <div
      ref={wrap}
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-3 bottom-[calc(var(--bottom-nav-h)+1rem)] transition-[opacity,transform] duration-300 lg:right-6 lg:bottom-6",
        shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
      inert={!shown || undefined}
    >
      <AnimatePresence>
        {open && (
          <m.div
            ref={panel}
            id="help-panel"
            role="dialog"
            aria-labelledby="help-title"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22 }}
            className="w-[min(20rem,calc(100vw-2rem))] origin-bottom-right rounded-lg border border-hairline bg-surface p-5 shadow-float"
          >
            <div className="mb-1 flex items-start justify-between gap-3">
              <h2 id="help-title" className="t-h3">{t("title")}</h2>
              <button type="button" onClick={() => setOpen(false)} className="-m-2 grid size-11 shrink-0 place-items-center rounded-sm hover:bg-paper-2" aria-label={t("close")}>
                <X size={18} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink-muted">{t("body")}</p>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {actions.map(({ href, label, Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="flex min-h-12 items-center gap-3 py-2 text-[0.9375rem] font-medium hover:text-accent-strong"
                  >
                    <Icon size={18} strokeWidth={1.5} aria-hidden className="shrink-0 text-ink-muted" />
                    <span className="break-all">{label}</span>
                    {external && <span className="sr-only">{ta("opensNewTab")}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="help-panel"
        className="btn btn-ink rounded-full px-4 shadow-float"
      >
        <MessageCircle size={18} strokeWidth={1.5} aria-hidden />
        <span>{t("button")}</span>
      </button>
    </div>
  );
}
