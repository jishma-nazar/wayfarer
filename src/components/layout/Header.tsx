"use client";

import { Heart, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useMounted, useScrolled } from "@/lib/hooks";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/ui/Wordmark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS } from "./nav";

export function Header() {
  const t = useTranslations("nav");
  const ta = useTranslations("a11y");
  const pathname = usePathname();
  const scrolled = useScrolled(24);
  const mounted = useMounted();
  const { items } = useSaved();
  const [menuOpen, setMenuOpen] = useState(false);

  // Over the home hero the header starts transparent on the photo, then turns solid.
  const overHero = pathname === "/" && !scrolled && !menuOpen;
  const tone = overHero ? "onPhoto" : "default";
  const savedCount = mounted ? items.length : 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[var(--header-h)] border-b transition-[background-color,border-color,color] duration-300",
          overHero ? "border-transparent bg-transparent text-[#f4efe6]" : "border-hairline bg-paper/95 text-ink backdrop-blur-sm supports-[backdrop-filter]:bg-paper/85"
        )}
      >
        {overHero && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 to-transparent" />
        )}
        <div className="container-x relative flex h-full items-center justify-between gap-4">
          <Link href="/" aria-label={ta("home")} className="-ml-1 rounded-sm px-1 py-2">
            <Wordmark onPhoto={overHero} />
          </Link>

          <nav aria-label={ta("mainNav")} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium transition-colors",
                        overHero ? "text-[#f4efe6]/90 hover:text-[#f4efe6]" : "text-ink-muted hover:text-ink",
                        active && (overHero ? "text-[#f4efe6]" : "text-ink")
                      )}
                    >
                      {t(item.key)}
                      {active && <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-px bg-accent" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1 md:flex">
              <ThemeToggle tone={tone} />
              <LanguageSwitcher tone={tone} />
            </div>
            <Link
              href="/saved"
              className={cn(
                "hidden min-h-11 items-center gap-1.5 rounded-sm px-2.5 text-sm font-medium xl:inline-flex",
                overHero ? "hover:bg-white/10" : "hover:bg-paper-2"
              )}
            >
              <Heart size={16} strokeWidth={1.5} aria-hidden />
              <span>{t("saved")}</span>
              {savedCount > 0 && (
                <span className="num grid min-w-5 place-items-center rounded-full bg-accent-strong px-1 text-[0.6875rem] font-bold text-accent-ink">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link href="/enquire" className={cn("btn hidden sm:inline-flex", overHero ? "bg-[#f4efe6] text-[#1b1a17] hover:bg-white" : "btn-primary")}>
              {t("planTrip")}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-sm px-2.5 text-sm font-semibold xl:hidden",
                overHero ? "hover:bg-white/10" : "hover:bg-paper-2"
              )}
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden />
              <span>{t("menu")}</span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
