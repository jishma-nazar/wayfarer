"use client";

import { Compass, Heart, Luggage, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useMounted } from "@/lib/hooks";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/cn";

/** Thumb-reach navigation for phones and tablets. */
export function BottomNav() {
  const t = useTranslations("nav");
  const ta = useTranslations("a11y");
  const pathname = usePathname();
  const mounted = useMounted();
  const { items } = useSaved();
  const count = mounted ? items.length : 0;

  const links = [
    { href: "/", label: t("explore"), Icon: Compass, active: pathname === "/" },
    { href: "/search", label: t("search"), Icon: Search, active: pathname.startsWith("/search") },
    { href: "/saved", label: t("saved"), Icon: Heart, active: pathname.startsWith("/saved"), badge: count },
    { href: "/trips", label: t("trips"), Icon: Luggage, active: pathname.startsWith("/trips") },
  ];

  return (
    <nav
      aria-label={ta("bottomNav")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-4">
        {links.map(({ href, label, Icon, active, badge }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-1 text-[0.75rem] font-semibold",
                active ? "text-ink" : "text-ink-muted"
              )}
            >
              {active && <span aria-hidden className="absolute inset-x-6 top-0 h-[2px] bg-accent" />}
              <span className="relative">
                <Icon size={20} strokeWidth={1.5} aria-hidden />
                {!!badge && (
                  <span className="num absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-accent-strong px-1 text-[0.625rem] leading-4 text-accent-ink">
                    {badge}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
