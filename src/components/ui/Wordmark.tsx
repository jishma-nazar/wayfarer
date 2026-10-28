import { cn } from "@/lib/cn";

/** Typographic wordmark. Swap the brand name here and in messages/meta.siteName. */
export function Wordmark({ className, size = "md", onPhoto }: { className?: string; size?: "md" | "xl"; onPhoto?: boolean }) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline whitespace-nowrap leading-none tracking-[-0.02em]",
        size === "md" ? "text-[1.375rem] sm:text-[1.5rem]" : "text-[clamp(3.5rem,14vw,13rem)] tracking-[-0.045em]",
        className
      )}
      style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
    >
      Wayfarer
      <span className={cn("ml-[0.18em] italic", onPhoto ? "text-[#f0b79c]" : "text-accent")} style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>
        &amp;&nbsp;Co.
      </span>
    </span>
  );
}
