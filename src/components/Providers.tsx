"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

// The no-flash theme script must run from the server HTML. When React re-renders the root layout on
// the client (a language switch), the theme is already applied, so the script is inert there and
// React's "script tag inside a component" warning stays quiet.
const themeScriptProps = { type: typeof window === "undefined" ? "text/javascript" : "text/plain" } as const;

const loadFeatures = () => import("@/lib/motion-features").then((m) => m.default);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="wf-theme" scriptProps={themeScriptProps}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
