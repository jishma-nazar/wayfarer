// Fails if any locale is missing keys (or has extra ones) compared with en.json.
import { readFileSync, readdirSync } from "node:fs";

const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}${Array.isArray(v) ? `[${v.length}]` : ""}`]
  );
const load = (f) => JSON.parse(readFileSync(`messages/${f}`, "utf8"));
const base = new Set(flat(load("en.json")));
let failed = false;
for (const f of readdirSync("messages").filter((f) => f !== "en.json" && f.endsWith(".json"))) {
  const keys = new Set(flat(load(f)));
  const missing = [...base].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !base.has(k));
  if (missing.length || extra.length) failed = true;
  console.log(`${f}: ${missing.length} missing, ${extra.length} extra`);
  missing.forEach((k) => console.log("  - missing", k));
  extra.forEach((k) => console.log("  + extra", k));
}
process.exit(failed ? 1 : 0);
