"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

const KEY = "wf:scroll-restore";
const stripLocale = (p: string) => p.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
const visible = (el: Element) => (el as HTMLElement).offsetParent !== null;

/** Stable selector for a landmark, identical in every language. */
function selectorFor(el: Element) {
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) return `[aria-labelledby="${CSS.escape(labelledby)}"]`;
  return el.id ? `#${CSS.escape(el.id)}` : null;
}

/**
 * Called right before a language switch. Records *what* the reader is looking at — the section at
 * the top of the viewport and how far into it they are — rather than a pixel offset, because
 * Spanish runs longer than English and the same pixel offset would land somewhere else.
 */
export function rememberScroll() {
  try {
    const probe = Math.min(160, window.innerHeight / 3);
    // Innermost labelled region under the probe line (visible tree only: Cache Components keeps the
    // previous language's tree mounted but hidden).
    const candidates = Array.from(document.querySelectorAll("main [aria-labelledby], main section[id], main article[id]")).filter(visible);
    const hit = candidates
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe && selectorFor(el);
      })
      .pop();
    const r = hit?.getBoundingClientRect();
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        path: stripLocale(location.pathname),
        y: window.scrollY,
        selector: hit ? selectorFor(hit) : null,
        progress: r ? (probe - r.top) / Math.max(1, r.height) : 0,
        probe,
        at: Date.now(),
      })
    );
  } catch {
    /* storage unavailable — fall back to Next's own scroll handling */
  }
}

type Saved = { path: string; y: number; selector: string | null; progress: number; probe: number; at: number };

export function ScrollRestorer() {
  const locale = useLocale();
  useEffect(() => {
    let saved: Saved | null = null;
    try {
      // Not removed yet: the outgoing tree can run this effect and then be hidden (its timers are
      // cleared), so the key stays until the visible tree has finished restoring.
      saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    } catch {
      return;
    }
    if (!saved || Date.now() - saved.at > 15_000 || saved.path !== stripLocale(location.pathname)) return;
    const s = saved;
    const target = () => {
      const el = s.selector ? Array.from(document.querySelectorAll(s.selector)).find(visible) : undefined;
      if (!el) return s.y;
      const r = el.getBoundingClientRect();
      return r.top + window.scrollY + s.progress * r.height - s.probe;
    };
    // Re-apply while the translated layout settles (late fonts, longer strings); timers rather than
    // rAF alone so it still lands in throttled tabs. Stops as soon as the reader scrolls themselves.
    let cancelled = false;
    const stop = () => (cancelled = true);
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    window.addEventListener("keydown", stop, { once: true });
    const delays = [0, 80, 250, 600];
    const timers = delays.map((ms, i) =>
      window.setTimeout(() => {
        if (document.documentElement.lang !== locale) return;
        if (!cancelled) window.scrollTo({ top: target(), behavior: "instant" });
        if (i === delays.length - 1) sessionStorage.removeItem(KEY);
      }, ms)
    );
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [locale]);
  return null;
}
