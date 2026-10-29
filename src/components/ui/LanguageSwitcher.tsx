"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { rememberScroll } from "@/components/layout/ScrollRestorer";

/** "EN · ES" — keeps the current path, query, hash and scroll position. Form drafts persist via useDraft. */
export function LanguageSwitcher({ className, tone = "default", size = "sm" }: { className?: string; tone?: "default" | "onPhoto"; size?: "sm" | "lg" }) {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    rememberScroll();
    const { search, hash } = window.location;
    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: next, scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      aria-busy={pending || undefined}
      className={cn("inline-flex items-center", size === "lg" ? "text-lg" : "text-sm", className)}
    >
      {routing.locales.map((l, i) => {
        const active = l === locale;
        return (
          <span key={l} className="inline-flex items-center">
            {i > 0 && (
              <span aria-hidden className={cn("px-0.5", tone === "onPhoto" ? "text-[#ffffff]/50" : "text-ink-faint")}>
                ·
              </span>
            )}
            <button
              type="button"
              lang={l}
              onClick={() => switchTo(l)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "inline-grid min-h-10 min-w-10 place-items-center rounded-full px-1.5 font-semibold uppercase tracking-[0.08em] transition-colors",
                tone === "onPhoto"
                  ? active
                    ? "text-[#ffffff] underline decoration-1 underline-offset-[6px]"
                    : "text-[#ffffff]/70 hover:text-[#ffffff]"
                  : active
                    ? "text-ink underline decoration-accent decoration-[1.5px] underline-offset-[6px]"
                    : "text-ink-muted hover:text-ink"
              )}
            >
              {/* Visible code + spoken language name, so the accessible name contains the visible label. */}
              <span>{l}</span>
              <span className="sr-only"> — {t(l)}</span>
            </button>
          </span>
        );
      })}
    </div>
  );
}
