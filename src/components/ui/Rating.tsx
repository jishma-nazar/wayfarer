import { useFormatter, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/** Five short bars, each filled to its share of the score, plus the number and review count. */
export function Rating({ score, count, className, tone = "default", compact }: { score: number; count: number; className?: string; tone?: "default" | "onDark"; compact?: boolean }) {
  const t = useTranslations("card");
  const format = useFormatter();
  const scoreText = format.number(score, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm", className)}>
      <span className="sr-only">{t("ratingLabel", { score: scoreText, count })}</span>
      <span aria-hidden className="flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, score - i));
          return (
            <span
              key={i}
              className={cn("relative h-[5px] w-3 overflow-hidden rounded-[1px]", tone === "onDark" ? "bg-white/25" : "bg-hairline-strong/70")}
            >
              <span
                className={cn("absolute inset-y-0 left-0", tone === "onDark" ? "bg-[#f4efe6]" : "bg-olive")}
                style={{ width: `${fill * 100}%` }}
              />
            </span>
          );
        })}
      </span>
      <span aria-hidden className="num font-semibold">{scoreText}</span>
      {!compact && (
        <span aria-hidden className={cn("num", tone === "onDark" ? "text-[#f4efe6]/80" : "text-ink-muted")}>
          ({t("reviews", { count })})
        </span>
      )}
    </p>
  );
}
