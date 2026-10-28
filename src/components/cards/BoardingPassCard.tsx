import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { TripPackage } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { usePrice } from "@/components/ui/Price";
import { cn } from "@/lib/cn";

/**
 * Package as a boarding pass: route in big monospace, perforated stub with the fare.
 * `notch` must match the surface the card sits on so the punched holes read as cut-outs.
 */
export function BoardingPassCard({ p, notch = "var(--olive-band)", className }: { p: TripPackage; notch?: string; className?: string }) {
  const t = useTranslations("content.packages");
  const tp = useTranslations("home.packages");
  const tc = useTranslations("card");
  const format = useFormatter();
  const price = usePrice();
  const title = t(`${p.id}.title`);
  const highlights = t.raw(`${p.id}.highlights`) as string[];
  const [y, mo] = p.departures.split("-").map(Number);
  const departure = format.dateTime(new Date(Date.UTC(y, mo - 1, 15)), { month: "short", year: "numeric", timeZone: "UTC" });

  return (
    <article className={cn("pass group relative flex flex-col overflow-visible rounded-lg bg-surface text-ink md:flex-row", className)} style={{ ["--notch-bg" as string]: notch }}>
      <div className="flex-1 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-ink-muted">{tp("pass")}</p>
          <p className="font-mono text-xs text-ink-muted">{p.fareCode}</p>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <p className="text-xs text-ink-muted">{tp("from")}</p>
            <p className="font-mono text-[clamp(2rem,6vw,2.75rem)] font-medium leading-none tracking-tight">{p.fromCode}</p>
            <p className="mt-1 truncate text-sm text-ink-muted">{t(`${p.id}.fromCity`)}</p>
          </div>
          <div aria-hidden className="mb-7 flex items-center gap-1 text-accent">
            <span className="block h-px w-6 border-t border-dashed border-current sm:w-12" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
            <span className="block h-px w-6 border-t border-dashed border-current sm:w-12" />
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-muted">{tp("to")}</p>
            <p className="font-mono text-[clamp(2rem,6vw,2.75rem)] font-medium leading-none tracking-tight">{p.toCode}</p>
            <p className="mt-1 truncate text-sm text-ink-muted">{t(`${p.id}.toCity`)}</p>
          </div>
        </div>
        <p className="sr-only">
          {tp("from")} {t(`${p.id}.fromCity`)} ({p.fromCode}), {tp("to")} {t(`${p.id}.toCity`)} ({p.toCode})
        </p>

        <h3 className="t-h3 mt-6">{title}</h3>
        <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-ink-muted">
          {highlights.map((h) => (
            <li key={h} className="flex gap-2.5">
              <span aria-hidden className="mt-[0.6em] block size-1 shrink-0 rounded-full bg-accent" />
              {h}
            </li>
          ))}
        </ul>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-dashed border-hairline-strong pt-4 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">{tp("duration")}</dt>
            <dd className="num font-mono font-medium">{tc("nights", { count: p.nights })}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">{tp("nextDeparture")}</dt>
            <dd className="num font-mono font-medium capitalize">{departure}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">{tp("gate")}</dt>
            <dd className="font-mono font-medium">{tp("gateValue")}</dd>
          </div>
        </dl>
      </div>

      <div className="pass-stub flex flex-col justify-between gap-5 p-5 sm:p-7 md:w-[15.5rem] md:shrink-0">
        <span aria-hidden className="pass-notch-top" />
        <span aria-hidden className="pass-notch-bottom" />
        <div>
          <p className="text-xs text-ink-muted">{tp("pricePrefix")}</p>
          <p className="num mt-1 font-display text-[2.5rem] leading-none">{price(p.price)}</p>
          <Rating score={p.rating} count={p.reviews} className="mt-3" />
        </div>
        <div className="flex flex-col gap-2">
          <Link href={`/enquire?package=${p.id}`} className="btn btn-primary w-full">
            {tc("enquire")}
            <span className="sr-only">: {title}</span>
          </Link>
          <SaveButton kind="package" id={p.id} name={title} tone="plain" className="w-full justify-center" />
        </div>
        {/* Decorative barcode */}
        <div aria-hidden className="hidden h-9 w-full md:block" style={{ background: "repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 4px, var(--ink) 4px 5px, transparent 5px 8px, var(--ink) 8px 11px, transparent 11px 12px)", opacity: 0.75 }} />
      </div>
    </article>
  );
}
