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

**Type:** Fraunces (display serif, soft optical axis) · Hanken Grotesk (UI/body) · JetBrains Mono (only for codes, coordinates and times).

**Palette:** one accent, used deliberately.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--paper` | `#F4EFE6` | `#14130F` | Page |
| `--paper-2` | `#EBE4D6` | `#1B1915` | Bands, insets |
| `--surface` | `#FBF8F2` | `#1F1D18` | Cards, sheets, inputs |
| `--ink` | `#1B1A17` | `#EDE6D8` | Text |
| `--ink-muted` | `#5E5A51` | `#A69E8E` | Secondary text |
| `--accent` | `#C4532D` | `#E07A52` | Decorative: stamps, routes, pins |
| `--accent-strong` | `#A8441F` | `#E58A63` | Accent text and primary buttons (AA) |
| `--olive` / `--olive-band` | `#4F5B3A` / `#3E4730` | `#A9B588` / `#29301F` | Secondary, packages band |

Dark mode is its own palette (warm charcoal, softened paper-white, lifted accent, dimmer photo grade, stronger scrims), not an inversion.

**Signature details**
1. **Boarding-pass packages:** route in monospace (`LIS → OPO`), perforated stub with punched notches, fare code, decorative barcode.
2. **Coordinates and live local time** on destination cards (`38.72° N · 14:32 local`), computed per IANA time zone in the visitor's browser.
3. **Dashed routes and passport stamps:** a dot-matrix world generated from real coastlines with a dashed route through featured places; an ink-textured stamp marks "Traveler favorite" items.

All tokens (colour, type scale, spacing, radii, elevation, motion) live in **`src/styles/tokens.css`**. `src/app/globals.css` maps them into Tailwind (`bg-paper`, `text-ink-muted`, `font-display`…), and Tailwind's default palette is switched off so only brand colours exist.

Photography comes from Unsplash: real, named places served through Unsplash's CDN (`src/lib/image-loader.ts` asks for AVIF/WebP at the right width). A shared CSS grade (`--photo-filter`) keeps them cohesive.

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
    cards/                DestinationCard, StayCard, ExperienceCard, BoardingPassCard
    results/              Results (filters, sort, empty states)
    pages/                SavedList, TripsList, EnquiryFlow
    ui/                   ThemeToggle, LanguageSwitcher, Rating, Carousel, Photo, Sheet,
                          SaveButton, PassportStamp, LocalTime, Reveal, Wordmark
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

Change `meta.siteName` and `meta.title` in each messages file, the text in `src/components/ui/Wordmark.tsx`, the ring text in `PassportStamp.tsx`, and the contact details in `src/lib/data.ts` (`contact`). Placeholder legal and registration text is in `footer.legal`.

## Known limits

- No backend: enquiries, newsletter sign-ups, saved items and trips are stored locally only. The phone number, WhatsApp link, email and registration number are placeholders.
- Flights are quoted by a person. The Flights tab collects a route and hands off to the enquiry form instead of showing fares.
- Mock prices and ratings are illustrative.
