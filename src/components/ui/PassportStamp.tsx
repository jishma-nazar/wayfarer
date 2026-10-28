import { useTranslations } from "next-intl";
import { useId } from "react";
import { cn } from "@/lib/cn";

/** Ink-stamp mark for "Traveler favorite" items. Decorative ring text; the label is announced once. */
export function PassportStamp({ className, size = 84 }: { className?: string; size?: number }) {
  const t = useTranslations("card");
  const id = useId().replace(/:/g, "");
  const label = t("favorite");
  return (
    <span className={cn("pointer-events-none inline-block -rotate-[11deg]", className)} style={{ width: size, height: size }}>
      <span className="sr-only">{label}</span>
      <svg viewBox="0 0 100 100" className="size-full text-accent" aria-hidden>
        <defs>
          <path id={`ring-${id}`} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
          <filter id={`ink-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.65" />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#ink-${id})`} fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="47" fill="var(--surface)" fillOpacity="0.9" strokeWidth="2" />
          <circle cx="50" cy="50" r="28" strokeWidth="1.2" />
          <text fill="currentColor" stroke="none" fontSize="9" fontFamily="var(--type-code)" letterSpacing="1.2" fontWeight="500">
            <textPath href={`#ring-${id}`} textLength="218" lengthAdjust="spacingAndGlyphs">
              {`${label.toUpperCase()} · WAYFARER & CO. ·`}
            </textPath>
          </text>
          <path d="M50 34 l3.2 9.8 h10.3 l-8.3 6 3.2 9.8 -8.4 -6 -8.4 6 3.2 -9.8 -8.3 -6 h10.3z" fill="currentColor" stroke="none" />
          <text x="50" y="72" textAnchor="middle" fill="currentColor" stroke="none" fontSize="7" fontFamily="var(--type-code)" letterSpacing="1">
            2026
          </text>
        </g>
      </svg>
    </span>
  );
}
