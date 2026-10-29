"use client";

import { m, useAnimationControls } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMounted } from "@/lib/hooks";
import { useSaved, type SavedItem } from "@/lib/saved";
import { cn } from "@/lib/cn";

/** Save without signing in — stored on this device. Visible text label + item name for screen readers. */
export function SaveButton({ kind, id, name, tone = "photo", className }: { kind: SavedItem["kind"]; id: string; name: string; tone?: "photo" | "plain"; className?: string }) {
  const t = useTranslations("card");
  const mounted = useMounted();
  const { isSaved, toggle } = useSaved();
  const saved = mounted && isSaved(kind, id);
  const controls = useAnimationControls();

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(kind, id);
        if (!saved) controls.start({ scale: [1, 1.35, 0.9, 1], transition: { duration: 0.45 } });
      }}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors",
        tone === "photo"
          ? "rounded-full bg-white/90 text-[#0e0e10] backdrop-blur-md hover:bg-white"
          : "border border-hairline-strong text-ink hover:border-ink",
        className
      )}
    >
      <m.span animate={controls} className="inline-flex" aria-hidden>
        <Heart
          size={16}
          strokeWidth={1.5}
          className={cn("transition-colors", saved ? "fill-[#ff5a1f] stroke-[#ff5a1f]" : "")}
        />
      </m.span>
      <span>{saved ? t("saved") : t("save")}</span>
      <span className="sr-only">{name}</span>
    </button>
  );
}
