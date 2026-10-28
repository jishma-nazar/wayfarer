import { useTranslations } from "next-intl";
import { destinations } from "@/lib/data";
import { MAP_VIEWBOX } from "@/lib/map-dots";
import { project } from "@/lib/geo";
import { MapPins } from "./MapPins";

/** Dot-matrix world (generated from Natural Earth) with a dashed route through featured places. */
export function MapMoment() {
  const t = useTranslations("home.map");
  const stops = destinations.filter((d) => d.mapOrder).sort((a, b) => a.mapOrder! - b.mapOrder!);
  const { width: W, height: H } = MAP_VIEWBOX;
  const pts = stops.map((d) => {
    const p = project(d.lon, d.lat);
    return { x: (p.x / 100) * W, y: (p.y / 100) * H };
  });
  // Gentle arcs between stops: control point lifted perpendicular to each leg.
  const route = pts
    .map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const a = pts[i - 1];
      const mx = (a.x + p.x) / 2;
      const my = (a.y + p.y) / 2;
      const dx = p.x - a.x;
      const dy = p.y - a.y;
      const k = 0.18;
      return `Q${(mx + dy * k).toFixed(1)} ${(my - Math.abs(dx) * k).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join("");

  return (
    <section aria-labelledby="map-title" className="container-x section-y">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow text-accent-strong">{t("eyebrow")}</p>
          <h2 id="map-title" className="t-h1 mt-3 max-w-[16ch]">{t("title")}</h2>
        </div>
        <p className="t-lead text-ink-muted lg:col-span-4 lg:col-start-9">{t("dek")}</p>
        <div className="lg:col-span-12">
          <MapPins
            ids={stops.map((s) => s.id)}
            map={
              <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
                {/* Land dots: a cached static SVG used as a mask, coloured by the theme token. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-hairline-strong"
                  style={{ mask: "url(/map-dots.svg) center / 100% 100% no-repeat", WebkitMask: "url(/map-dots.svg) center / 100% 100% no-repeat" }}
                />
                <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label={t("mapLabel")}>
                <path
                  d={route}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.4"
                  strokeDasharray="5 6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                </svg>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
