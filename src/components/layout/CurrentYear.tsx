"use client";

import { useNow } from "@/lib/hooks";

/** Year read from the visitor's clock after hydration (Cache Components forbids `new Date()` in the prerender). */
export function CurrentYear() {
  const now = useNow();
  return <span className="num inline-block min-w-[4ch]">{now?.getFullYear() ?? ""}</span>;
}
