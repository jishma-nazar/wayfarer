import { cn } from "@/lib/cn";

/** Typographic wordmark. Swap the brand name here and in messages/meta.siteName. */
export function Wordmark({ className, size = "md", onPhoto }: { className?: string; size?: "md" | "xl"; onPhoto?: boolean }) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline whitespace-nowrap font-bold leading-none",
        size === "md" ? "text-[1.25rem] tracking-[-0.03em] max-[380px]:text-[1.1rem] sm:text-[1.55rem]" : "text-[clamp(2.75rem,15vw,16rem)] tracking-[-0.045em]",
        className
      )}
      style={{ fontVariationSettings: '"opsz" 96, "wdth" 100' }}
    >
      wayfarer
      <span className={cn("ml-[0.08em]", onPhoto ? "text-[#ff8a5c]" : "text-accent")}>&amp;co.</span>
    </span>
  );
}
