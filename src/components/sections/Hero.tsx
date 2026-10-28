import { Headphones, RotateCcw, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { destinations, heroPhoto } from "@/lib/data";
import { formatCoords } from "@/lib/geo";
import { Photo } from "@/components/ui/Photo";
import { SearchModule } from "@/components/search/SearchModule";

export function Hero() {
  const t = useTranslations("home.hero");
  const tt = useTranslations("trust");
  const td = useTranslations("content.destinations");
  const locale = useLocale();
  const douro = destinations.find((d) => d.id === "douro")!;

  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="relative -mt-[var(--header-h)] h-[min(88svh,860px)] min-h-[560px] overflow-hidden bg-[#2a2620]">
        <Photo photo={heroPhoto} alt={td("douro.alt")} sizes="100vw" preload quality={55} className="absolute inset-0 h-full" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--scrim-strong)] via-[rgba(18,16,12,0.18)] to-[rgba(18,16,12,0.32)]" />
        <div className="container-x relative flex h-full flex-col justify-end pb-[clamp(6.5rem,13vw,9.5rem)]">
          <h1 id="hero-title" className="t-display max-w-[13ch] text-[#f6f1e8]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
            {t("headline")}
          </h1>
          <p className="t-lead mt-5 max-w-[46ch] text-[#f6f1e8]/88">{t("lead")}</p>
        </div>
        <p className="absolute bottom-[clamp(6.5rem,13vw,9.5rem)] right-[var(--gutter)] hidden max-w-[16rem] text-right text-xs leading-relaxed text-[#f6f1e8]/80 lg:block">
          <span className="block">
            {td("douro.caption")}, {td("douro.country")}
          </span>
          <span className="num font-mono">{formatCoords(douro.lat, douro.lon, locale)}</span>
        </p>
      </div>

      <div className="container-x relative z-10 -mt-[clamp(4.5rem,9vw,6.5rem)]">
        <div className="md:rounded-lg md:border md:border-hairline md:bg-surface md:p-6 md:shadow-float lg:px-8 lg:pb-8">
          <SearchModule variant="hero" persistKey="home-search" />
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <li className="inline-flex items-center gap-2">
            <span aria-hidden className="flex gap-[2px]">
              {[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-[5px] w-2.5 rounded-[1px] bg-olive" />)}
            </span>
            <span className="num">{tt("rating", { count: 3214 })}</span>
          </li>
          <li className="inline-flex items-center gap-2"><RotateCcw size={15} strokeWidth={1.5} aria-hidden />{tt("freeCancellation")}</li>
          <li className="inline-flex items-center gap-2"><ShieldCheck size={15} strokeWidth={1.5} aria-hidden />{tt("secure")}</li>
          <li className="inline-flex items-center gap-2"><Headphones size={15} strokeWidth={1.5} aria-hidden />{tt("support")}</li>
        </ul>
      </div>
    </section>
  );
}
