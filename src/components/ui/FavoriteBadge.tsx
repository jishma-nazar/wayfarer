import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/** "Traveler favorite" pill for image cards. */
export function FavoriteBadge({ className }: { className?: string }) {
  const t = useTranslations("card");
  return (
    <span className={cn("inline-flex h-8 items-center gap-1.5 rounded-full bg-[#ff5a1f] px-3 text-xs font-semibold text-[#0e0e10]", className)}>
      <Star size={13} strokeWidth={2} className="fill-current" aria-hidden />
      {t("favorite")}
    </span>
  );
}
