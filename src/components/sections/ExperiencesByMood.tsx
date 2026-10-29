"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { experiences } from "@/lib/data";
import { MOODS, type Mood } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ExperienceCard } from "@/components/cards/ExperienceCard";

const LIMIT = 6;

export function ExperiencesByMood() {
  const t = useTranslations("home.moods");
  const tm = useTranslations("moods");
  const [mood, setMood] = useState<Mood | "all">("all");
  const matching = mood === "all" ? experiences : experiences.filter((e) => e.moods.includes(mood));
  const shown = matching.slice(0, LIMIT);
  const count = (m: Mood | "all") => (m === "all" ? experiences.length : experiences.filter((e) => e.moods.includes(m)).length);

  return (
    <section aria-labelledby="moods-title" className="bg-paper-2 section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow inline-flex items-center gap-2 text-accent-strong">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {t("eyebrow")}
            </p>
            <h2 id="moods-title" className="t-h1 mt-4">{t("title")}</h2>
          </div>
          <div className="lg:col-span-8 lg:pt-10">
            <div role="radiogroup" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
              {(["all", ...MOODS] as const).map((mo) => {
                const active = mood === mo;
                return (
                  <button
                    key={mo}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMood(mo)}
                    className={cn(
                      "inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-[0.9375rem] font-semibold transition-colors",
                      active ? "border-accent bg-accent text-accent-ink" : "border-hairline-strong bg-surface hover:border-ink"
                    )}
                  >
                    {mo === "all" ? t("all") : tm(mo)}
                    <span className={cn("num text-xs", active ? "text-accent-ink/70" : "text-ink-faint")}>{count(mo)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-ink-muted" aria-live="polite">
              {t("showing", { shown: shown.length, total: matching.length })}
            </p>
          </div>
        </div>

        <ul role="list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((e) => (
              <m.li
                key={e.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35 }}
              >
                <ExperienceCard e={e} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-12">
          <Link href={mood === "all" ? "/experiences" : `/experiences?mood=${mood}`} className="btn btn-ink">
            {t("cta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
