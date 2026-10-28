"use client";

import { ArrowRight, Luggage } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useMounted } from "@/lib/hooks";
import { tripsStore } from "@/lib/saved";
import { useStore } from "@/lib/store";

export function TripsList() {
  const t = useTranslations("trips");
  const mounted = useMounted();
  const trips = useStore(tripsStore);
  const format = useFormatter();

  if (!mounted) return <div className="container-x min-h-[40vh]" aria-busy="true" />;

  if (!trips.length) {
    return (
      <div className="container-x pb-24">
        <div className="rounded-lg border border-dashed border-hairline-strong px-6 py-16 text-center">
          <Luggage size={28} strokeWidth={1.5} aria-hidden className="mx-auto text-accent" />
          <h2 className="t-h2 mt-4">{t("emptyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-ink-muted">{t("emptyBody")}</p>
          <Link href="/enquire" className="btn btn-primary mt-8">
            {t("emptyCta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pb-24">
      <ul role="list" className="border-t border-ink">
        {trips.map((trip) => (
          <li key={trip.ref} className="grid gap-4 border-b border-hairline py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <p className="font-mono text-sm">
              <span className="text-ink-muted">{t("ref")} </span>
              {trip.ref}
            </p>
            <div>
              <h2 className="t-h3">{trip.destination}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {t("sent", { date: format.dateTime(new Date(trip.sentAt), { dateStyle: "medium", timeStyle: "short" }) })} ·{" "}
                {t("travellers", { adults: trip.adults, children: trip.children })}
              </p>
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-olive">
              <span aria-hidden className="size-2 rounded-full bg-olive" /> {t("status")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
