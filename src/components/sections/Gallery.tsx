import { useTranslations } from "next-intl";
import { gallery } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHead } from "./SectionHead";

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];
const SPEEDS = [60, -90, 110, -50];

/** Photo wall in four columns that drift at different speeds as you scroll. */
export function Gallery() {
  const t = useTranslations("home.gallery");
  const tg = useTranslations("content.gallery");
  const cols = [0, 1, 2, 3].map((c) => gallery.filter((_, i) => i % 4 === c));

  return (
    <section aria-labelledby="gallery-title" className="overflow-hidden section-y">
      <div className="container-x">
        <SectionHead id="gallery-title" eyebrow={t("eyebrow")} title={t("title")} dek={t("dek")} />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cols.map((col, c) => (
            <Parallax key={c} distance={SPEEDS[c]} className={cn(c >= 2 && "hidden lg:block", c % 2 === 1 && "mt-12")}>
              <ul role="list" className="space-y-3 sm:space-y-4">
                {(c < 2 ? [...col, ...cols[c + 2]] : col).map((g, i) => (
                  <li key={g.id} className={cn(i >= col.length && "lg:hidden")}>
                    <figure className="group relative overflow-hidden rounded-[22px]">
                      <Photo
                        photo={g.photo}
                        alt={tg(`${g.id}.alt`)}
                        sizes="(min-width: 1024px) 24vw, 48vw"
                        className={ASPECTS[(c + i) % ASPECTS.length]}
                        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.08]"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-sm font-medium text-white lg:translate-y-2 lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                        {tg(`${g.id}.caption`)}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
