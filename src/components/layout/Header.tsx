"use client";

import { Heart, Menu, UserRound } from "lucide-react";
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
  const tAuth = useTranslations("auth");
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
          "sticky top-0 z-50 h-[var(--header-h)] transition-colors duration-300",
          overHero ? "text-white" : "text-ink"
        )}
      >
        {overHero && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/40 to-transparent" />
        )}
        {/* Off the hero the bar floats as a frosted pill. */}
        <div className="container-x relative h-full py-2">
        <div
          className={cn(
            "flex h-full items-center justify-between gap-4 rounded-full transition-all duration-500",
            overHero ? "px-1" : "border border-hairline bg-paper/80 pl-5 pr-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          )}
        >
          <Link href="/" aria-label={ta("home")} className="-ml-1 rounded-full px-1 py-2">
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
                        "relative inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-3 text-[0.9375rem] font-medium transition-colors 2xl:px-4",
                        overHero ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink-muted hover:bg-paper-2 hover:text-ink",
                        active && (overHero ? "bg-white/15 text-white" : "bg-paper-2 text-ink")
                      )}
                    >
                      {t(item.key)}
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
              href="/sign-in"
              aria-current={pathname.startsWith("/sign-") ? "page" : undefined}
              className={cn(
                // Room is tight when the full nav shows (xl), so sign-in moves into the menu there.
                "hidden min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-medium lg:inline-flex xl:hidden 2xl:inline-flex",
                overHero ? "hover:bg-white/10" : "hover:bg-paper-2"
              )}
            >
              <UserRound size={16} strokeWidth={1.75} aria-hidden />
              <span>{tAuth("account")}</span>
            </Link>
            <Link
              href="/saved"
              className={cn(
                "hidden min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-medium 2xl:inline-flex",
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
            <Link href="/enquire" className={cn("btn hidden sm:inline-flex", overHero ? "btn-light" : "btn-primary")}>
              {t("planTrip")}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold 2xl:hidden",
                overHero ? "hover:bg-white/10" : "hover:bg-paper-2"
              )}
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden />
              <span>{t("menu")}</span>
            </button>
          </div>
        </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
