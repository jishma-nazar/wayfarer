// Equirectangular projection — must match scripts/gen-map-dots.mjs.
const LON0 = -168, LON1 = 180, LAT0 = 72, LAT1 = -56;

/** Position as a percentage of the map box. */
export function project(lon: number, lat: number) {
  return {
    x: ((lon - LON0) / (LON1 - LON0)) * 100,
    y: ((LAT0 - lat) / (LAT0 - LAT1)) * 100,
  };
}

export function formatCoords(lat: number, lon: number, locale: string) {
  const nf = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${nf.format(Math.abs(lat))}° ${ns} · ${nf.format(Math.abs(lon))}° ${ew}`;
}
