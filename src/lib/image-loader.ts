import type { ImageLoaderProps } from "next/image";

// Unsplash's imgix CDN resizes and negotiates AVIF/WebP via `auto=format`,
// so images skip the Next.js optimizer entirely.
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality && quality !== 75 ? quality : 70));
  return url.toString();
}
