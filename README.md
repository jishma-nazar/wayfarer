# Wayfarer & Co.

A bilingual (English / Spanish) travel-agency site: editorial magazine look, booking-product usability.
Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · next-intl · next-themes · Framer Motion · lucide-react.

"Wayfarer & Co." is a placeholder. To rename it, see [Renaming the brand](#renaming-the-brand).

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en or /es by browser language
npm run build && npm start
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build. Every page is prerendered for both locales. |
| `npm run lint` | ESLint |
| `npm run check:messages` | Fails if `messages/*.json` are missing keys compared with `en.json` |
| `npm run gen:map` | Regenerates the dot-matrix world map from Natural Earth (`src/lib/map-dots.ts`) |

Set `NEXT_PUBLIC_SITE_URL` in production. It feeds canonical URLs, hreflang, the sitemap and Open Graph tags.

## Design system

Immersive and bold: crisp white and cinematic black, one sunset accent, big photography with text set on the image, rounded cards and pill controls.

**Type:** Bricolage Grotesque (display) · Geist (UI and body) · Geist Mono (codes, coordinates and times only).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--paper` | `#FFFFFF` | `#0B0B0D` | Page |
| `--paper-2` | `#F3F3F0` | `#141417` | Bands, field fills |
| `--surface` | `#FFFFFF` | `#17171B` | Cards, sheets |
| `--ink` | `#0E0E10` | `#F6F6F2` | Text |
| `--ink-muted` | `#55555C` | `#A3A3AB` | Secondary text |
| `--accent` | `#FF5A1F` | `#FF6A33` | Primary buttons (dark text), pins, routes |
| `--accent-strong` | `#C2410C` | `#FF8A5C` | Accent used as text (AA) |

All tokens (colour, type scale, spacing, radii, elevation, motion) live in **`src/styles/tokens.css`**. Add the class `theme-dark` to any element to give that section the dark palette; the packages band, map and footer use it, and every component inside adapts with no extra styles.

**Motion** (all of it is off for `prefers-reduced-motion`):
- Hero: full-screen crossfading slideshow with a slow Ken Burns push-in, word-by-word headline rise (pure CSS, so it paints before hydration), slide progress bars and a pause control.
- Two-row destination marquee that pauses on hover or focus.
- `Reveal`: content fades up as it scrolls in, hiding only what starts below the fold.
- `Parallax`: scroll-linked depth on the promises backdrop and the four-column photo gallery.
- Packages: on large screens the section pins and vertical scroll slides the trips sideways; phones get a swipeable row.
- Map: the dashed route draws itself in, a light travels along it, and pins pulse.
- Stats count up when they come into view; stories crossfade full-bleed.

Photography comes from Unsplash: real, named places served through Unsplash's CDN (`src/lib/image-loader.ts` asks for AVIF/WebP at the right width). Only the current and next hero slides are fetched.

## Project structure

```
messages/                 en.json, es.json: every string, including alt text, aria labels and errors
src/
  app/[locale]/           routes (home, destinations, stays, experiences, packages, journal,
                          search, saved, trips, enquire, not-found)
  app/robots.ts, sitemap.ts, icon.svg
  i18n/                   routing (locales), navigation helpers, request config
  proxy.ts                locale negotiation + redirect (Next 16's middleware)
  components/
    layout/               Header, MobileMenu, Footer, BottomNav, HelpButton, ScrollRestorer
    sections/             home page sections (Hero, Trending, EditorsPicks, …)
    search/               SearchModule, DestinationField (combobox), date/guest fields, Popover
    cards/                DestinationCard, StayCard, ExperienceCard, PackageCard
    results/              Results (filters, sort, empty states)
    pages/                SavedList, TripsList, EnquiryFlow
    ui/                   ThemeToggle, LanguageSwitcher, Rating, Carousel, Photo, Sheet, SaveButton,
                          FavoriteBadge, LocalTime, Reveal, Parallax, CountUp, Wordmark
  lib/                    typed mock data, search (typo/accent tolerant), storage, validation, geo
  styles/tokens.css       design tokens for both themes
```

## How things work

- **Search** tolerates accents, case and small typos ("cancun" → Cancún, "kyto" → Kyoto, "Lisboa" → Lisbon) using accent folding plus edit distance with transpositions. Aliases in `src/lib/data.ts` cover other spellings and regions. Only a destination is required; dates default to "Flexible" and guests to 2 adults. Recent searches are stored locally.
- **Filters** live in the URL, so they survive reloads, sharing and language switches. Each option shows its result count, options that would return nothing are disabled, and active filters are chips you remove one at a time.
- **Saved and Trips** need no account: items are stored in `localStorage`. On the Saved page, un-saving keeps the card until you leave, so a mis-tap is one tap to undo.
- **Enquiry** is three steps with a progress bar, validation on blur, an error summary that moves focus to the first problem, and a review step with per-row Edit. It has no backend: sending simulates a round trip and records the enquiry under Trips.
- **Language and theme switches never lose your place.** Form drafts persist in `sessionStorage` (`useDraft`). Before a language switch, `ScrollRestorer` records which section you're reading and how far in, then restores that spot in the other language rather than a raw pixel offset, because Spanish runs longer.
- **Theme** defaults to the system setting, persists your choice, and the no-flash script runs before first paint. Colours cross-fade for 200ms only while the theme is changing.

## Adding a language

1. Add the locale code to `routing.locales` in `src/i18n/routing.ts`.
2. Copy `messages/en.json` to `messages/<code>.json` and translate every value. Keep ICU placeholders (`{count}`, `{price}`) and tags (`<b>…</b>`) intact. Run `npm run check:messages` until it reports `0 missing`.
3. Add the language's display name under `language` in **every** messages file (for example `"fr": "Français"`). The switcher lists `routing.locales` automatically.
4. In `src/app/[locale]/layout.tsx`, nothing changes: `<html lang>`, hreflang alternates, the sitemap and static generation all read `routing.locales`.
5. For the best search results, add the new language's place names to the `aliases` arrays in `src/lib/data.ts`.
6. Update the locale pattern in `stripLocale` inside `src/components/layout/ScrollRestorer.tsx`.

Prices are USD, formatted with `Intl` for each locale (`$1,840` / `1840 US$`). Dates, numbers and plurals all go through next-intl's formatter.

## Accessibility

- Skip link, visible focus rings, and full keyboard paths through menus, sheets, popovers, the combobox and carousels.
- Real form labels, correct mobile keyboards (`inputMode`, `autocomplete`, `enterkeyhint`), and errors wired up with `aria-describedby` and `aria-invalid`.
- Focus is trapped in dialogs, Escape closes them, and focus returns to whatever opened them.
- Carousels: native scroll-snap, labelled region and buttons. The stories carousel can be paused and never auto-rotates for reduced-motion users.
- Every icon has a text label; icon-only buttons have an accessible name.
- Colour pairs are documented with their contrast ratios in `tokens.css` (AA in both themes).
- `prefers-reduced-motion` disables reveals and transitions globally.

## Renaming the brand

Change `meta.siteName` and `meta.title` in each messages file, the text in `src/components/ui/Wordmark.tsx`, and the contact details in `src/lib/data.ts` (`contact`). Placeholder legal and registration text is in `footer.legal`.

## Known limits

- No backend: enquiries, newsletter sign-ups, saved items and trips are stored locally only. The phone number, WhatsApp link, email and registration number are placeholders.
- Flights are quoted by a person. The Flights tab collects a route and hands off to the enquiry form instead of showing fares.
- Mock prices and ratings are illustrative.
