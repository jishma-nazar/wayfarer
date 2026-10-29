import { useTranslations } from "next-intl";
import { destinations } from "@/lib/data";
import { MAP_VIEWBOX } from "@/lib/map-dots";
import { project } from "@/lib/geo";
import { MapPins } from "./MapPins";
import { SectionHead } from "./SectionHead";

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
    <section aria-labelledby="map-title" className="theme-dark section-y">
      <div className="container-x">
        <SectionHead id="map-title" eyebrow={t("eyebrow")} title={t("title")} dek={t("dek")} />
        <div className="mt-12">
          <MapPins ids={stops.map((s) => s.id)} route={route} width={W} height={H} label={t("mapLabel")} />
        </div>
      </div>
    </section>
  );
}
