import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

// Display: a bold, slightly condensed grotesk for big confident headlines.
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  variable: "--font-display-face",
  display: "swap",
});

// UI and body text.
export const sans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-face",
  display: "swap",
});

// Only for codes, coordinates and times.
export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
  preload: false,
});
