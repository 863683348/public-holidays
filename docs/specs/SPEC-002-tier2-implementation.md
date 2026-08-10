# SPEC-002 — Tier 2 implementation spec

**Contract for the frontend engineer. Decisions and rationale live in
[ADR-001](../decisions/ADR-001-holiday-detail-page.md), [ADR-002](../decisions/ADR-002-icon-library.md)
and [ESTIMATE](../specs/ESTIMATE-tier2-3-dev.md). Read those first.**
This file is the executable checklist for Tier 2 (T2-①②③). Tier 1 must be merged
first — every file below builds on the Tier 1 baseline (110 countries, `slug.ts`,
`holiday-facts.ts`, `holidays/sitemap.ts`, `[holiday]` route).

**Open decisions (user confirmed defaults; each is cheap to change later):**

| # | Decision | Default used | Change cost |
|---|----------|--------------|-------------|
| O1 | /compare default selection + homepage embed | **top-4 popular (US/GB/CA/AU), NOT embedded on homepage** | Low (edit `DEFAULT_SELECTION`) |
| O2 | /today freshness — **not in this spec** (Tier 3) | — | — |
| O3 | blog cluster languages — **not in this spec** (Tier 3) | — | — |
| O4 | B2B `/for-teams` route — **referenced only** (landing exists in Tier 3; T2 only links to it) | `/for-teams` | Low before launch |

---

## 0. File manifest

| # | Path | Action | Est. LOC |
|---|------|--------|----------|
| 1 | `src/lib/compare.ts` | **new** — parse/validate selection + overlap computation + share URL | ~140 |
| 2 | `src/lib/compare.test.ts` | **new** — vitest, ~8 cases | ~90 |
| 3 | `src/lib/region-names.ts` | **new** — ISO-3166-2 → readable region name (Intl.DisplayNames, fallback raw code) | ~40 |
| 4 | `src/lib/region-names.test.ts` | **new** — ~4 cases | ~30 |
| 5 | `src/lib/seo.ts` | edit — add `webPageDetail()` helper | +35 |
| 6 | `src/lib/countries.ts` | edit — `getPaaFaqWhenNext()`-style PAA hooks (optional; see §5) | +15 |
| 7 | `src/app/[locale]/compare/page.tsx` | **new** — server shell, ISR, `robots: noindex` | ~70 |
| 8 | `src/components/compare/CompareClient.tsx` | **new** — client orchestrator | ~90 |
| 9 | `src/components/compare/MultiSelect.tsx` | **new** — 2–6 country picker with Chip | ~70 |
| 10 | `src/components/compare/CompareMatrix.tsx` | **new** — month grid + highlight columns | ~120 |
| 11 | `src/components/compare/Legend.tsx` | **new** — color legend | ~25 |
| 12 | `src/components/compare/ShareBar.tsx` | **new** — share URL copy | ~50 |
| 13 | `src/components/FaqAccordion.tsx` | **new** — unified FAQ UI (details/summary) | ~60 |
| 14 | `src/components/HolidayFaq.tsx` | edit — wrap/replace with FaqAccordion (keep export for compat) | ±15 |
| 15 | `src/components/CountryHolidayView.tsx` | edit — FAQ block → FaqAccordion; PAA hook question; 🔥 existing `📅` already replaced in T1 — verify | ±30 |
| 16 | `src/components/HolidayDetailView.tsx` | edit — adjacent-year verified links, next-occurrence FAQ, regional partition, multi-date weekday rows, WebPage JSON-LD | ±70 |
| 17 | `src/app/[locale]/link-to-us/page.tsx` | edit — full i18n + dynamic `COUNTRIES.length` + emoji → lucide + `Link` from `@/i18n/navigation` | ±60 |
| 18 | `src/app/[locale]/page.tsx` | edit — localize About section (new `homeAbout` namespace) + link to `/for-teams` | ±20 |
| 19 | `src/app/[locale]/blog/[category]/[slug]/page.tsx` | edit — localize chrome, `next/link` → i18n Link, localized share labels | ±40 |
| 20 | `src/app/[locale]/pricing/PricingClient.tsx` | edit — local `Check` → lucide `Check`; `freeFeatures` → dynamic count | ±10 |
| 21 | `src/app/sitemap.ts` | edit — add `/for-teams` static entry | +3 |
| 22 | `src/i18n/messages/*.json` × 11 | edit — `compare` + `linkToUs` + `homeAbout` + `holidayDetail` additions + `blog` additions | ~+60 each |
| 23 | `src/components/compare/*.test.tsx` *(optional)* | skip — logic tests cover the meat; UI smoke via manual | 0 |

**Hard constraint: no file over 300 lines.** `CompareMatrix.tsx` is at risk — split
month rows into `src/components/compare/MonthGrid.tsx` if it grows past 300.

---

## 1. `src/lib/compare.ts` (new) — logic layer

Pure functions, no React, no I/O (holiday data is passed in). This is the unit-tested
core; the page just feeds it data.

```ts
import type { Holiday } from "./types";

export const COMPARE_MIN = 2;
export const COMPARE_MAX = 6;
export const DEFAULT_SELECTION = ["US", "GB", "CA", "AU"]; // O1: top-4 popular
export const DEFAULT_YEAR = new Date().getFullYear();

/** Parse ?c=US,GB,DE&y=2026. Malformed input → null → caller falls back to defaults. NEVER throws. */
export function parseCompareParams(
  c: string | null, y: string | null
): { codes: string[]; year: number } | null;

/** Validate + dedupe codes against getCountry(); clamp year via parseYear.
 *  Invalid/too-few/too-many → fall back to DEFAULT_SELECTION / DEFAULT_YEAR. */
export function resolveCompareSelection(
  codes: string[], year: number | null
): { codes: string[]; year: number };

/** Month length helper, UTC-safe (reuse longWeekend.ts conventions). */
export function monthLength(year: number, monthIndex: number): number;

export interface CompareMatrix {
  year: number;
  countries: { code: string; name: string; holidays: Holiday[] }[];
  /** ISO dates present in EVERY selected country's holiday set. */
  allOff: string[];
  /** Per-country long-weekend counts (reuse findLongWeekends). */
  longWeekendCounts: Record<string, number>;
}

export function computeCompareMatrix(
  countries: { code: string; name: string; holidays: Holiday[] }[],
  year: number
): CompareMatrix;

/** Share URL: `${origin}${locale}/compare?c=US,GB,DE&y=2026`. */
export function encodeShareUrl(origin: string, locale: string, codes: string[], year: number): string;
```

### Rules

- `parseCompareParams`: `c` split on `,`/`+`, trim, `toUpperCase`, drop empties,
  dedupe; `y` must be integer via `parseYear` from `src/lib/year-window.ts`. Any
  failure → `null`.
- `resolveCompareSelection`: codes outside `getCountry()` dropped; if result < 2 or
  > 6 → return `DEFAULT_SELECTION` + `DEFAULT_YEAR` (lenient, never error).
- `computeCompareMatrix.allOff` = dates present in **every** country (using the
  same `Holiday.date` string, so no timezone issue). May be empty — the UI renders
  the near-miss state, not an error.
- `monthLength` must be UTC-exact (Feb 2026 = 28, leap handled via
  `Date.UTC(year, month+1, 0).getUTCDate()`).
- The month-days grid itself lives in `CompareMatrix` consumer components; this
  module only provides the `monthLength` primitive.

### Required test vectors (`src/lib/compare.test.ts`)

| # | Case | Expectation |
|---|------|-------------|
| 1 | `parseCompareParams("us,GB,us", "2026")` | `["US","GB"]`, 2026 (dedupe + uppercase) |
| 2 | `parseCompareParams(null, null)` | `null` |
| 3 | `parseCompareParams("US", "1999")` | `null` (year out of window) |
| 4 | `resolveCompareSelection(["US","GB","XX"], 2026)` | `["US","GB"]` (unknown dropped) |
| 5 | `resolveCompareSelection(["US"], 2026)` | `DEFAULT_SELECTION` (too few) |
| 6 | `resolveCompareSelection(["US","GB","DE","FR","IT","ES","JP"], 2026)` | `DEFAULT_SELECTION` (too many) |
| 7 | `computeCompareMatrix` with US+GB 2026 fixture | `allOff` contains only real shared dates; `longWeekendCounts` matches `findLongWeekends` |
| 8 | `computeCompareMatrix` with US+JP+DE fixture | `allOff` may be `[]` — assert it does not throw |
| 9 | `encodeShareUrl` round-trip | `decode(encode(x))` → same codes/year |

---

## 2. `/compare` UI

### 2a. `src/app/[locale]/compare/page.tsx` (server shell)

- `export const revalidate = 86400;`
- `generateMetadata`: title/description from `messages/compare`; `robots: { index: false, follow: true }` (query-param URL — never indexed; the value is shareability, not crawl).
- Reads `searchParams` (`c`, `y`), resolves via `parseCompareParams` +
  `resolveCompareSelection`, fetches `getHolidays(code, year)` for each selected
  country (bounded: 2–6 countries, fetch-cached 90 d; no new upstream).
- Renders `<CompareClient countries year allOff longWeekendCounts />`.
- **Do NOT** fetch all 110 countries — only the selection.
- Year selector options 2000–2035 (from `year-window`), rendered as links that
  rebuild `?c=...&y=...` (keeps the page server-rendered and share-URL-stable).

### 2b. `CompareClient.tsx` (client)

Orchestrates `MultiSelect` + year selector + `CompareMatrix` + `Legend` + `ShareBar`.
State = selected codes. On change → `router.replace` the share URL (`useRouter` from
`@/i18n/navigation`) so back/forward and copy-paste both work. Re-fetching on change
is NOT required if `page.tsx` already SSR'd the matrix for the current selection —
but simplest correct approach: selection change navigates to the new URL and lets the
server render. Do the server round-trip.

### 2c. Components (all in `src/components/compare/`)

- **MultiSelect**: text-input + filtered list (reuse the filter logic pattern from
  `CountrySelector.tsx:23-30`, but chips instead of buttons); selected countries as
  removable `Chip`s; enforce 2–6 (disable add at 6; show hint at < 2).
- **CompareMatrix**: header row = country codes; body = 12 month sections; each day
  cell colored: common-holiday cell (all selected countries have a holiday) vs
  single-country holiday cell vs plain. `aria-label` per cell with the holiday names.
- **Legend**: 3 swatches — "Holiday in all selected" / "Holiday in some" / "No holiday".
- **ShareBar**: shows current share URL; copy button (reuse the `copyLink`/`copied`
  pattern from `CountryHolidayView`'s copy button if present — otherwise
  `navigator.clipboard` with a copied state).

### 2d. Empty / near-miss state (required)

When `allOff.length === 0` (real for US+JP+DE): render the **near-miss** block —
dates where the *most* selected countries share a holiday (max-set by frequency),
with the countdown of countries not off. Never render a bare empty grid.

---

## 3. T2-③ QA advisory closure on the holiday detail page

### 3a. Adjacent-year verified links + next-occurrence FAQ — `HolidayDetailView.tsx`

- Best-effort fetch (wrap in `Promise.allSettled`, skip when year out of window):
  `getHolidays(country, year-1)` and `getHolidays(country, year+1)`.
- Render a prev/next "same holiday in {year±1}" link **only when** the fetched year's
  groups contain the same slug (`findHolidayGroup`). No unverified links.
- FAQ addition (when primary date has passed): "When is the next {name} in {country}?"
  answered from the **next-year** group's primaryDate when available; omit the item
  otherwise.
- New i18n keys (`holidayDetail`): `adjacentHeading`, `prevYearLink` (`"{name} in {year}"`),
  `nextYearLink`, `faqNextOccurrence`, `faqNextOccurrenceAnswer`, `faqNextOccurrenceNone`.
- Upstream failure → omit both links and the FAQ item; never fail the page.

### 3b. WebPage JSON-LD — `src/lib/seo.ts` + detail view

```ts
export function webPageDetail(opts: {
  canonical: string; title: string; description: string;
  locale: string; dateModified: string; eventId: string;
}): Record<string, unknown>
```

Mirror the WebPage shape at `CountryHolidayView.tsx` (author/publisher/isPartOf
Organization "PubHoliday"), with `mainEntity: { "@id": eventId }`. Emit as a fourth
`<script type="application/ld+json">` in `HolidayDetailView`.

### 3c. Regional partition names — `src/lib/region-names.ts` (new)

```ts
/** ISO-3166-2 "AU-WA" → "Western Australia"; falls back to the raw code. */
export function regionName(iso3166_2: string): string
```

Implementation: `Intl.DisplayNames(["en"], { type: "region" }).of(code)` for the
subdivision part; if undefined → return the raw `iso3166_2`. **English names only**
(consistent 11-locale behavior; localizing 400+ region names across 11 languages is
out of scope — see Do-not-do). Render a regional table in the detail view when
`group.counties !== null` (heading `regionsHeading`, each row `regionName(c)`).

### 3d. Multi-date per-date weekday rows

Replace the plain `{allDates.map(d => <li>{d}</li>)}` block with a small table:
**Date | Weekday** per entry, weekday via the existing UTC-safe
`new Date(d + "T00:00:00Z").toLocaleDateString(locale, { weekday: "long", timeZone: "UTC" })`.
Reuse `datesHeading`; add `datesWeekdayHeading` if the table needs a header.

---

## 4. T2-② PAA copy layer

### 4a. Unify FAQ presentation — `FaqAccordion.tsx` (new)

`<details>/<summary>`-based accordion (no new deps; works without JS, keyboard-native):
```tsx
export default function FaqAccordion({ items }: { items: { question: string; answer: string }[] })
```
Replace the FAQ block in **both** `CountryHolidayView.tsx` (country FAQ) and
`HolidayDetailView.tsx` (via `HolidayFaq.tsx` which becomes a thin wrapper around
`FaqAccordion` to keep existing imports working). FAQPage JSON-LD is unchanged — the
visible copy and the structured data stay in sync (same items array).

### 4b. PAA hooks — add, don't rewrite

- **Country-year page**: append one question to the existing FAQ array in
  `CountryHolidayView.tsx`: `faqWhenNext` = "When is the next public holiday in
  {country}?" answered with the already-computed `nextHoliday` (no new fetch).
  Keys: `faqWhenNext`, `faqWhenNextAnswer` in `country` namespace × 11.
- **Do NOT change** the existing description-style titles on country/year pages
  (they rank; the ESTIMATE + competitor report both say preserve). PAA-style titles
  already ship on holiday-detail pages from Tier 1.

### 4c. Remediate hardcoded-EN files (the bulk of T2-②)

1. **`link-to-us/page.tsx`** — full localization:
   - All visible copy → new `linkToUs` namespace × 11 (~18 keys).
   - Stale **"46 Countries"** → render at runtime:
     `import { COUNTRIES } from "@/lib/countries"` and interpolate
     `{count: COUNTRIES.length}` (110). Same for the footer/attribution HTML strings —
     build them as functions `(count: number) => string`.
   - Emoji section icons (`✈️ 🏢 🌐 📚`, L154-167) → lucide `Plane` / `Building2` /
     `Globe` / `GraduationCap` (ADR-002); `✅`/`❌` bullets (L195-199) → lucide
     `Check` / `X`.
   - `import Link from "next/link"` → `Link` from `@/i18n/navigation` (L182-186 uses
     locale-aware hrefs; the current `next/link` double-prefix bug pattern must not be
     copied — `CountryHolidayView.tsx:394` is the cautionary tale).
   - `generateMetadata` → localized titles/descriptions.

2. **Homepage About section** (`[locale]/page.tsx:82-102`) — move hardcoded English
   to new `homeAbout` namespace × 11 (`heading`, `p1`, `p2`, `li1..li4`, `forTeamsLink`,
   `forTeamsLinkLabel`), with the `{count}` interpolation for
   `COUNTRIES.length` at L97. Add a link to `/for-teams` (route lands in Tier 3; the
   link is forward-compatible).

3. **Blog article page** (`blog/[category]/[slug]/page.tsx`) — localize the chrome:
   breadcrumb labels (`Home`/`Blog`), `By {author}`, `Category:`, FAQ heading, share
   buttons text, and switch `import Link from "next/link"` → i18n `Link`
   (L88-98, L140-170, L184-188). Share button labels via `blog.shareTwitter` /
   `shareLinkedIn` / `shareFacebook` keys. Keep `post.title`/content as-is (data, not chrome).

4. **`PricingClient.tsx`** — replace the local hand-rolled `Check` SVG (L7-13) with
   lucide `Check` (ADR-002 consistency); `freeFeatures` "Browse 46 countries" →
   `t("freeFeatures")` with `{count: COUNTRIES.length}` interpolation (needs the key
   change to `freeFeaturesCount` or an ICU `{count}` placeholder in all 11 locales).

### 4d. Sitemap — `src/app/sitemap.ts`

Add `/for-teams` to the static pages array (priority 0.6, monthly). Compare/today stay
out of sitemaps (noindex).

---

## 5. i18n key inventory (add to ALL 11 `messages/*.json`)

| Namespace | Keys | Notes |
|-----------|------|-------|
| `compare` (new) | `metaTitle`, `metaDescription`, `heading`, `subtitle`, `pickCountries`, `maxCountries`, `minCountries`, `legendAll`, `legendSome`, `legendNone`, `allOffHeading`, `allOffNone` (near-miss), `nearMissPrefix`, `sharedCount` (`{count}`), `longWeekendCount` (`{count}`), `share`, `copied`, `yearLabel` | ~19 |
| `linkToUs` (new) | `metaTitle`, `metaDescription`, `heroHeading`, `heroBody`, `whyHeading`, `card46`→`cardCountries` (`{count}`), `cardLanguages`, `cardFree`, `badgeHeading`, `textLinkHeading`, `footerLinkHeading`, `attributionHeading`, `idealHeading`, `travel`, `travelBody`, `hr`, `hrBody`, `dir`, `dirBody`, `edu`, `eduBody`, `popularHeading`, `guidelinesHeading`, `li1..li5`, `preview` | ~24 |
| `homeAbout` (new) | `heading`, `p1`, `p2`, `li1`, `li2`, `li3`, `li4` (`{count}`), `forTeamsLink`, `forTeamsLinkLabel` | ~9 |
| `country` (add) | `faqWhenNext`, `faqWhenNextAnswer` | +2 |
| `holidayDetail` (add) | `adjacentHeading`, `prevYearLink`, `nextYearLink`, `faqNextOccurrence`, `faqNextOccurrenceAnswer`, `faqNextOccurrenceNone`, `regionsHeading`, `datesWeekdayHeading` | +8 |
| `blog` (add) | `shareTwitter`, `shareLinkedIn`, `shareFacebook`, `byAuthor` (`{author}`), `categoryLabel` (`{category}`) | +5 |
| `pricing` (edit) | `freeFeatures[0]` → `{count}` placeholder form | ±1 |

**Do not machine-translate holiday names, region names, or the link-to-us HTML
snippets** — those stay English by design. Region names are English-only (see §3c).

---

## 6. Build order

1. `compare.ts` + `compare.test.ts` — **green before any UI**.  (independent)
2. `region-names.ts` + tests — 15 min, unblocks §3c.  (independent)
3. `seo.ts` `webPageDetail()` + unit-free (pure shape) — 15 min.  (independent)
4. `FaqAccordion.tsx` + `HolidayFaq.tsx` wrapper + swap both call sites.
5. `HolidayDetailView.tsx` T2-③ additions (§3a/b/c/d) + `holidayDetail` keys.
6. `compare/page.tsx` + compare components (server shell → client → matrix/legend/share).
7. PAA hook in `CountryHolidayView` (`faqWhenNext`) + `country` keys.
8. Hardcoded-EN remediations: link-to-us → homepage About → blog article → PricingClient.
9. `sitemap.ts` `/for-teams` entry.
10. Full DoD sweep (§7).

Steps 1–3 are pure logic, independently verifiable; 4–6 UI; 7–9 copy/i18n. With two
devs: one takes 1→3→5→6 (features), the other 4→7→8→9 (copy/refactor) — the seams are
independent except step 4 (FaqAccordion) which should land before both swap call sites.

---

## 7. Definition of Done

1. `npx tsc --noEmit` clean; vitest suite green (`compare`, `region-names`, existing
   `slug`, `longWeekend`, `holiday-facts`).
2. `/compare?c=US,GB,DE&y=2026` renders; `?c=US` and `?c=US,GB,DE,FR,IT,ES,JP` fall
   back to defaults without 400; share URL copy round-trips.
3. Compare matrix: common-holiday cells highlighted; `allOff=[]` (US+JP+DE) shows the
   near-miss block, not an empty grid.
4. Detail page: adjacent-year links appear only for verified years; next-occurrence
   FAQ appears only after the primary date; regional table renders for `counties`
   groups; multi-date rows show weekday; WebPage JSON-LD present (4 ld+json blocks).
5. Emoji grep over `src/app` + `src/components` returns zero hits:
   `grep -rnP '[\x{1F300}-\x{1F9FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]' src/app src/components`
6. All 11 `messages/*.json` contain `compare`, `linkToUs`, `homeAbout` namespaces and
   the added keys — no silent English fallback.
7. No ranking country/year `<title>` changed (only added FAQ entries).
8. `/link-to-us` shows "110 countries" at runtime (derived), lucide icons, localized copy.
9. `robots.txt` unchanged (no new sitemap); `/sitemap.xml` includes `/for-teams`.

---

## 8. Do not do

- Do not add `generateStaticParams` anywhere (site-wide ISR philosophy, ADR-001 §11).
- Do not fetch all 110 countries for `/compare` — only the 2–6 selected.
- Do not index `/compare` (query-param space; `robots: noindex`).
- Do not rewrite existing ranking titles/descriptions on country/year pages.
- Do not invent region-name translations for 11 locales — English `Intl.DisplayNames`
  with raw-code fallback only.
- Do not add `offers`/venue to any Event schema (ADR-001 §6.1).
- Do not introduce a second icon library; replace every remaining functional emoji
  with lucide (ADR-002).
- Do not hardcode `46`/`110` anywhere — always `COUNTRIES.length` at render time.
- Do not copy the `next/link` absolute-`/${locale}/...` href pattern into i18n `Link`
  (double-prefix bug, see `CountryHolidayView.tsx:394`).
- Do not localize the link-to-us embed HTML snippets (badge/footer/attribution) — they
  are machine-consumed by third-party sites; count interpolation only.
