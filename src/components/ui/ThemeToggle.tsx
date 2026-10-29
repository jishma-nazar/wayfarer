"use client";

import { m } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/** Briefly enable colour transitions so the switch fades (~200ms) instead of snapping. */
export function useThemeSwitch() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const change = (next: string) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 260);
  };
  return { change, theme, resolvedTheme };
}

/**
 * Header switch labelled "Dark": on = dark theme. Follows the system setting until the visitor
 * flips it; the knob slides and the icon swaps sun ↔ moon.
 */
export function ThemeToggle({ className, tone = "default" }: { className?: string; tone?: "default" | "onPhoto" }) {
  const t = useTranslations("theme");
  const mounted = useMounted();
  const { change, resolvedTheme } = useThemeSwitch();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => change(isDark ? "light" : "dark")}
      className={cn(
        "group inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium",
        tone === "onPhoto" ? "text-white hover:bg-white/10" : "text-ink hover:bg-paper-2",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
          tone === "onPhoto" ? "border-white/60" : "border-hairline-strong",
          isDark && "bg-ink/10"
        )}
      >
        <m.span
          className={cn(
            "absolute left-0.5 grid size-4 place-items-center rounded-full",
            tone === "onPhoto" ? "bg-white text-[#0e0e10]" : "bg-ink text-paper"
          )}
          initial={false}
          animate={{ x: isDark ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 32 }}
        >
          {isDark ? <Moon size={10} strokeWidth={2} /> : <Sun size={10} strokeWidth={2} />}
        </m.span>
      </span>
      <span>{t("dark")}</span>
    </button>
  );
}

/** Three-way control (Light · Dark · System) for the menu and footer. */
export function ThemeSegmented({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const mounted = useMounted();
  const { change, theme } = useThemeSwitch();
  const current = mounted ? theme ?? "system" : undefined;
  const options = [
    { value: "light", label: t("light"), Icon: Sun },
    { value: "dark", label: t("dark"), Icon: Moon },
    { value: "system", label: t("system"), Icon: Monitor },
  ] as const;

  return (
    <div role="radiogroup" aria-label={t("label")} className={cn("inline-flex rounded-full border border-hairline-strong p-1", className)}>
      {options.map(({ value, label, Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => change(value)}
            className={cn(
              "relative inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
              active ? "text-paper" : "text-ink-muted hover:text-ink"
            )}
          >
            {active && (
              <m.span layoutId="theme-seg" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
            )}
            <Icon size={16} strokeWidth={1.5} className="relative" aria-hidden />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
