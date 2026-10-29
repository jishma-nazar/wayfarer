"use client";

import { ArrowRight, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { byId } from "@/lib/data";
import { useMounted } from "@/lib/hooks";
import { useSaved, type SavedItem } from "@/lib/saved";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { StayCard } from "@/components/cards/StayCard";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { PackageCard } from "@/components/cards/PackageCard";

const ORDER: SavedItem["kind"][] = ["stay", "experience", "package", "destination"];

export function SavedList() {
  const t = useTranslations("saved");
  const tr = useTranslations("results");
  const mounted = useMounted();
  const { items } = useSaved();
  // Snapshot on arrival: un-saving keeps the card here (heart empty) so a mis-tap is one tap to undo.
  const [shown, setShown] = useState<SavedItem[] | null>(null);
  if (mounted && shown === null) setShown(items);
  const list = shown ?? [];

  if (!mounted) return <div className="container-x min-h-[40vh]" aria-busy="true" />;

  if (list.length === 0) {
    return (
      <div className="container-x pb-24">
        <div className="rounded-lg border border-dashed border-hairline-strong px-6 py-16 text-center">
          <Heart size={28} strokeWidth={1.5} aria-hidden className="mx-auto text-accent" />
          <h2 className="t-h2 mt-4">{t("emptyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-ink-muted">{t("emptyBody")}</p>
          <Link href="/" className="btn btn-primary mt-8">
            {t("emptyCta")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
        <p className="num text-ink-muted" aria-live="polite">{t("count", { count: items.length })}</p>
        <Link href="/enquire" className="btn btn-primary">
          {t("enquireAll")} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
      <div className="mt-10 space-y-14">
        {ORDER.map((kind) => {
          const group = list.filter((i) => i.kind === kind);
          if (!group.length) return null;
          return (
            <section key={kind} aria-labelledby={`saved-${kind}`}>
              <h2 id={`saved-${kind}`} className="eyebrow mb-6 text-ink-muted">{tr(`kinds.${kind}`)}</h2>
              <ul role="list" className={kind === "package" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"}>
                {group.map((i) => (
                  <li key={`${i.kind}:${i.id}`}>
                    {kind === "stay" && byId.stay(i.id) && <StayCard s={byId.stay(i.id)!} />}
                    {kind === "experience" && byId.experience(i.id) && <ExperienceCard e={byId.experience(i.id)!} />}
                    {kind === "package" && byId.package(i.id) && <PackageCard p={byId.package(i.id)!} />}
                    {kind === "destination" && byId.destination(i.id) && <DestinationCard d={byId.destination(i.id)!} />}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
