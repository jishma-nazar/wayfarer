import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whyPhoto } from "@/lib/data";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Parallax";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Cinematic band: parallax photo, counting stats, then four promises on glass cards. */
export function WhyUs() {
  const t = useTranslations("home.why");
  const ts = useTranslations("home.stats");
  const promises = t.raw("promises") as { title: string; body: string }[];
  const stats = [
    { value: 40, label: ts("countries") },
    { value: 12000, suffix: "+", label: ts("travellers") },
    { value: 4.9, decimals: 1, label: ts("rating") },
    { value: 60, prefix: "<", label: ts("reply") },
  ];

  return (
    <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-black text-white">
      <Parallax distance={120} className="absolute inset-[-120px_0] -z-10">
        <Photo photo={whyPhoto} alt="" sizes="100vw" className="h-full" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />

      <div className="container-x section-y">
        <Reveal className="max-w-3xl">
          <p className="eyebrow inline-flex items-center gap-2 text-[#ff8a5c]">
            <span aria-hidden className="size-1.5 rounded-full bg-[#ff5a1f]" />
            {t("eyebrow")}
          </p>
          <h2 id="why-title" className="t-h1 mt-4">{t("title")}</h2>
        </Reveal>

        <dl aria-label={ts("label")} className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/20 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="num font-display text-[clamp(3rem,2rem+4vw,6rem)] font-bold leading-none tracking-[-0.05em]">
                <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </dd>
              <dd aria-hidden className="mt-3 text-white/75">{s.label}</dd>
            </div>
          ))}
        </dl>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 100} className="h-full rounded-[24px] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
                <span aria-hidden className="num font-mono text-sm text-[#ff8a5c]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-6">{p.title}</h3>
                <p className="mt-3 text-white/75">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Link href="/enquire" className="btn btn-primary mt-12">
          {t("cta")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
