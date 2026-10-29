import { Headphones, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { SearchModule } from "@/components/search/SearchModule";
import { HeroSlideshow } from "./HeroSlideshow";

export function Hero() {
  const tt = useTranslations("trust");

  return (
    <section aria-labelledby="hero-title" className="relative">
      <HeroSlideshow />
      <div className="container-x relative z-10 -mt-[clamp(5rem,10vh,7rem)]">
        <div className="md:rounded-[28px] md:bg-surface md:p-6 md:shadow-float lg:px-8 lg:pb-8">
          <SearchModule variant="hero" persistKey="home-search" />
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-ink-muted">
          <li className="inline-flex items-center gap-2"><Star size={15} strokeWidth={1.75} className="fill-accent text-accent" aria-hidden /><span className="num">{tt("rating", { count: 3214 })}</span></li>
          <li className="inline-flex items-center gap-2"><RotateCcw size={15} strokeWidth={1.75} aria-hidden />{tt("freeCancellation")}</li>
          <li className="inline-flex items-center gap-2"><ShieldCheck size={15} strokeWidth={1.75} aria-hidden />{tt("secure")}</li>
          <li className="inline-flex items-center gap-2"><Headphones size={15} strokeWidth={1.75} aria-hidden />{tt("support")}</li>
        </ul>
      </div>
    </section>
  );
}
