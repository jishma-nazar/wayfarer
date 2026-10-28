"use client";

import { useLocale, useTranslations } from "next-intl";
import { useNow } from "@/lib/hooks";

/** "14:32 local" — rendered after mount (it depends on the visitor's clock). Width is reserved to avoid layout shift. */
export function LocalTime({ timeZone, place, className }: { timeZone: string; place: string; className?: string }) {
  const t = useTranslations("card");
  const locale = useLocale();
  const now = useNow();
  const time = now
    ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(now)
    : "--:--";
  return (
    <span className={className}>
      <span aria-hidden>{t("localTime", { time })}</span>
      {now && <span className="sr-only">{t("localTimeLabel", { place, time })}</span>}
    </span>
  );
}
