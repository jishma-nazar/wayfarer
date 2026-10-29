import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Photo } from "@/components/ui/Photo";

const PHOTO = { id: "1612698093158-e07ac200d44e", focus: "50% 50%" };

/** Split screen: form on one side, a full-height travel photo with a quote on the other. */
export function AuthShell({ children }: { children: ReactNode }) {
  const t = useTranslations("auth");
  return (
    <div className="container-x grid min-h-[calc(100svh-var(--header-h))] gap-8 pb-10 pt-2 lg:grid-cols-2 lg:gap-12">
      <div className="flex items-center justify-center py-6 lg:py-12">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
      <figure className="relative isolate order-first hidden min-h-[560px] overflow-hidden rounded-[32px] text-white lg:order-none lg:block">
        <Photo photo={PHOTO} alt={t("photoCaption")} sizes="50vw" preload className="absolute inset-0 -z-10 h-full" imgClassName="kenburns" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <figcaption className="absolute inset-x-0 bottom-0 p-10">
          <p className="max-w-[18ch] font-display text-[clamp(2rem,1.2rem+2.4vw,3.5rem)] font-semibold leading-[1] tracking-[-0.03em]">{t("quote")}</p>
          <p className="mt-5 text-sm text-white/75">{t("photoCaption")}</p>
        </figcaption>
      </figure>
    </div>
  );
}
