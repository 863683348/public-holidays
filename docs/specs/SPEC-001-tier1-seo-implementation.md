# SPEC-001 — Tier 1 SEO implementation spec

**Contract for the frontend engineer. Decisions and rationale live in
[ADR-001](../decisions/ADR-001-holiday-detail-page.md) and
[ADR-002](../decisions/ADR-002-icon-library.md) — read those first.**
This file is the executable checklist: exact files, exact signatures, exact order.

Repo: `public-holidays` · Next.js 15 App Router · React 19 · next-intl 3 ·
Tailwind 3 · 11 locales · no `generateStaticParams` anywhere.

---

## 0. File manifest

| # | Path | Action | Est. LOC |
|---|------|--------|----------|
| 1 | `src/lib/year-window.ts` | **new** — shared `MIN_YEAR`/`MAX_YEAR`/`parseYear` | ~15 |
| 2 | `src/lib/slug.ts` | **new** — slugify + group + lookup | ~120 |
| 3 | `src/lib/types.ts` | edit — add `launchYear`, export `HolidayGroup` | +6 |
| 4 | `src/lib/holidays.ts` | edit — handle HTTP 204 | +4 |
| 5 | `src/lib/seo.ts` | edit — add `holidayEvent()`, `holidayEventList()`; fix mojibake at L15/L106 | +60 |
| 6 | `src/lib/countries.ts` | edit — +64 countries, +64 demonyms, +2 title helpers | +150 |
| 7 | `src/lib/holiday-facts.ts` | **new** — pure fact derivation (weekday, daysUntil, bridge day, scope) | ~110 |
| 8 | `src/components/HolidayDetailView.tsx` | **new** — page body | ~260 |
| 9 | `src/components/HolidaySiblingList.tsx` | **new** — "other holidays in this country-year" | ~50 |
| 10 | `src/app/[locale]/[country]/[year]/[holiday]/page.tsx` | **new** — route + `generateMetadata` | ~110 |
| 11 | `src/app/holidays/sitemap.ts` | **new** — third sitemap | ~70 |
| 12 | `src/app/robots.ts` | edit — register third sitemap | +1 |
| 13 | `src/app/sitemap.ts` | edit — skip data-less countries (optional, see §9) | +8 |
| 14 | `src/i18n/messages/*.json` × 11 | edit — new `holidayDetail` namespace | +40 each |
| 15 | `src/components/CountryHolidayView.tsx` | edit — replace `📅` (L256) with `CalendarDays` | ±3 |
| 16 | `src/components/ThemeToggle.tsx` | edit — replace `☀`/`☾` (L27) with `Sun`/`Moon` | ±5 |
| 17 | `src/lib/slug.test.ts` | **new** — vitest | ~70 |
| 18 | `package.json` | edit — add `lucide-react@^1.29.0` | +1 |

**Hard constraint: no file over 300 lines.** `HolidayDetailView.tsx` is the one at
risk — if it grows past that, split the FAQ block into
`src/components/HolidayFaq.tsx`.

---

## 1. `src/lib/year-window.ts` (new)

`2000`/`2035` is currently duplicated in
`src/app/[locale]/[country]/[year]/page.tsx:10-11` and
`src/components/YearNav.tsx:18-19`. Single-source it, then update both call sites.

```ts
export const MIN_YEAR = 2000;
export const MAX_YEAR = 2035;

/** Returns the year, or null if not an integer inside [MIN_YEAR, MAX_YEAR]. */
export function parseYear(raw: string): number | null {
  const y = Number(raw);
  if (!Number.isInteger(y) || y < MIN_YEAR || y > MAX_YEAR) return null;
  return y;
}
```

---

## 2. `src/lib/slug.ts` (new)

```ts
import type { Holiday, HolidayGroup } from "./types";

export function slugifyHoliday(name: string): string;
export function groupHolidays(holidays: Holiday[]): HolidayGroup[];
export function findHolidayGroup(holidays: Holiday[], slug: string): HolidayGroup | null;
```

### `slugifyHoliday` — exact algorithm

Apply in order:

1. `String(name ?? "")`
2. `.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")`
3. `.replace(/['\u2018\u2019\u00b4` + "`" + `]/g, "")` — **delete, do not replace with `-`**
4. `.replace(/&/g, "-and-")`
5. `.toLowerCase()`
6. `.replace(/[^a-z0-9]+/g, "-")`
7. `.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "")`
8. truncate to 80 chars, then cut back to the last `-` if the truncation landed mid-word
9. `|| "holiday"`

### `groupHolidays` — merge rules

Iterate `holidays` in API order, key by `slugifyHoliday(h.name)`:

| Field | Merge rule |
|-------|-----------|
| `slug` | the key |
| `name` | first record's `name` |
| `localName` | `localName` of the earliest-dated record |
| `dates` | `[...new Set(records.map(r => r.date))].sort()` |
| `primaryDate` | `dates[0]` |
| `types` | de-duplicated union, order-preserving |
| `counties` | `null` if **any** record has `global === true` or `counties === null`; otherwise de-duplicated union, sorted |
| `global` | `records.some(r => r.global)` |
| `fixed` | `records.every(r => r.fixed)` |
| `launchYear` | first non-null `launchYear`, else `null` |
| `records` | all records, sorted by `date` |

Return sorted ascending by `primaryDate`, tie-broken by `slug` for determinism.

### `findHolidayGroup`

Case-insensitive: compare `slugifyHoliday`-normalised input against group slugs.
Returns `null` when absent — the caller decides between `notFound()` and redirect.

### Required test vectors (`src/lib/slug.test.ts`)

| Input | Expected |
|-------|----------|
| `"New Year's Day"` | `new-years-day` |
| `"Święto Konstytucji 3 Maja"` | `swieto-konstytucji-3-maja` |
| `"Día de la Hispanidad"` | `dia-de-la-hispanidad` |
| `"Christmas & Boxing Day"` | `christmas-and-boxing-day` |
| `"  --Foo--  "` | `foo` |
| `""` / `null` | `holiday` |

Grouping, against live 2026 fixtures (commit the JSON fixtures; do not hit the
network in tests):

| Case | Expectation |
|------|-------------|
| US 2026 | 17 records → **15** groups |
| US 2026 `good-friday` | 1 group, `dates.length === 1`, `types` = `["Public","Optional"]`, `counties` = 11 codes, `global === false` |
| US 2026 `columbus-day` | 1 group, `global === true` (one record is global) → `counties === null` |
| AU 2026 `labour-day` | 1 group, `dates` = `["2026-03-02","2026-03-09","2026-05-04","2026-10-05"]` |
| KR 2026 `lunar-new-year` | 1 group, 3 consecutive dates, `global === true` |
| RU 2026 | 13 records → **9** groups |

---

## 3. `src/lib/types.ts` (edit)

```ts
export interface Holiday {
  // ...existing fields unchanged...
  launchYear?: number | null;   // ADD — already present in the wire payload
}

export interface HolidayGroup {
  slug: string;
  name: string;
  localName: string;
  dates: string[];
  primaryDate: string;
  types: string[];
  counties: string[] | null;
  global: boolean;
  fixed: boolean;
  launchYear: number | null;
  records: Holiday[];
}
```

---

## 4. `src/lib/holidays.ts` (edit) — the 204 fix

Nager returns **HTTP 204 No Content** for a country/year with no data. `res.ok` is
`true` for 204, so the current code reaches `await res.json()` on an empty body and
throws `SyntaxError`. Seven live countries hit this today: `IN AE TH MY TW SA IL`.

Insert between the `!res.ok` guard (L60-62) and `const data = await res.json()` (L63):

```ts
if (res.status === 204) {
  await cache.put(key, "[]");
  return [];
}
```

Caching `[]` also stops the un-cached re-fetch on every request for those countries.

---

## 5. `src/lib/seo.ts` (edit)

### 5a. Fix the two mojibake strings (pre-existing defect, same file)

- L15: `` `${countryName} ${year}?????` `` → `` `${countryName} ${year}年公共假期` ``
- L106: `"??????"` → the zh brand name; confirm against `messages/zh.json → site.title`

### 5b. Add `holidayEvent(group, countryCode, countryName, locale, url)`

Returns the object in ADR-001 §6.1. Rules:
- `alternateName` present **only** when `group.localName !== group.name`
- `location` is `{ "@type": "Place", name: countryName, address: { "@type": "PostalAddress", addressCountry: countryCode } }`
- `startDate` = `endDate` = `group.primaryDate`
- `eventStatus: "https://schema.org/EventScheduled"`
- `eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode"`
- `isAccessibleForFree: true`
- No `offers`, no `performer`, no `organizer`. Do not invent fields to silence GSC warnings.

### 5c. Add `holidayEventList(group, countryCode, countryName, locale, url)`

Used when `group.dates.length > 1`. `ItemList` of `Event` nodes, one per date,
matching the existing `holidayItemList` shape (L6-29). When a date maps to records
with `counties`, add `address.addressRegion` from the ISO-3166-2 code.

`breadcrumb()` and `faqPage()` are reused unchanged.

---

## 6. `src/lib/holiday-facts.ts` (new) — pure derivation, no I/O

```ts
export type BridgeAdvice = "long-weekend" | "take-monday" | "take-friday" | "midweek" | "weekend";

export interface HolidayFacts {
  weekdayIndex: number;        // 0=Sun .. 6=Sat, from primaryDate
  isWeekend: boolean;
  isFuture: boolean;
  daysUntil: number;           // negative when past
  bridge: BridgeAdvice;
  scope: "national" | "regional" | "unknown";
  regionCount: number;
  isPublic: boolean;           // types includes "Public"
  otherTypes: string[];        // types minus "Public"
  multiDate: boolean;
}

export function deriveHolidayFacts(group: HolidayGroup, today: Date): HolidayFacts;
```

`bridge` mapping from `weekdayIndex`: `1` (Mon) or `5` (Fri) → `long-weekend`;
`2` (Tue) → `take-monday`; `4` (Thu) → `take-friday`; `3` (Wed) → `midweek`;
`0`/`6` → `weekend`.

Parse dates as UTC (`new Date(dateStr + "T00:00:00Z")`) and derive the weekday with
`getUTCDay()`. Do **not** use the server's local timezone — it shifts the weekday for
half the world and would make the answer box wrong.

---

## 7. Route — `src/app/[locale]/[country]/[year]/[holiday]/page.tsx` (new)

```ts
export const revalidate = 86400;   // no generateStaticParams — see ADR-001 §11
```

### Param handling order (strict)

1. `const { locale, country, year, holiday } = await params;`
2. `const meta = getCountry(country); if (!meta) notFound();`
3. `const y = parseYear(year); if (y === null) notFound();`
4. `const canonicalSlug = slugifyHoliday(decodeURIComponent(holiday));`
5. If `country !== meta.code` **or** `holiday !== canonicalSlug` →
   `permanentRedirect(\`/${locale}/${meta.code}/${y}/${canonicalSlug}\`)`
6. `let holidays; try { holidays = await getHolidays(meta.code, y); } catch { return <DataLagFallback/>; }`
7. `if (holidays.length === 0)` → render empty state (metadata already `noindex`)
8. `const group = findHolidayGroup(holidays, canonicalSlug); if (!group) notFound();`
9. Render `<HolidayDetailView … />`

`DataLagFallback` reuses the markup at `CountryHolidayView.tsx:57-66` (`country.dataLag`).
It must **not** `notFound()` — an upstream blip must not emit 404s for valid URLs.

### `generateMetadata`

- Returns `{}` when country or year is invalid (mirrors `[year]/page.tsx:31`).
- Title / description from `getHolidayDetailTitle()` / `getHolidayDetailDescription()`.
- `alternates` exactly as ADR-001 §10.4 — 11 languages + `x-default` → `en`.
- `robots: { index: false, follow: true }` when `holidays.length === 0` or the group is missing.
- Calls `getHolidays` — safe, Next dedupes identical `fetch` calls within a request.

### Best-effort adjacent years

```ts
const [prevRes, nextRes] = await Promise.allSettled([
  y - 1 >= MIN_YEAR ? getHolidays(meta.code, y - 1) : Promise.resolve([]),
  y + 1 <= MAX_YEAR ? getHolidays(meta.code, y + 1) : Promise.resolve([]),
]);
```
Render a prev/next link only when the settled value contains the same slug.
A rejection is silent — omit the link and the corresponding FAQ sentence.

---

## 8. `src/components/HolidayDetailView.tsx` (new)

Server Component. Sections in this DOM order (ADR-001 §5.2):

1. JSON-LD `<script>` blocks: Event (or ItemList when `multiDate`), BreadcrumbList (4 levels), FAQPage, WebPage
2. Breadcrumb links back to `/{country}` and `/{country}/{year}`
3. `<h1>` — `{name}` + `({localName})` when different + `— {localisedCountry} {year}`
4. **Answer box** — must be the first prose after H1: weekday, long date, days-until
5. At-a-glance table
6. Multi-date table — only when `group.dates.length > 1`
7. Regional breakdown — only when `group.counties !== null`
8. Bridge-day note
9. Same holiday in adjacent years — verified links only
10. `<HolidaySiblingList />`
11. FAQ (4–6 items) — same visual pattern as `CountryHolidayView.tsx:369-381`
12. Data-provenance block — copy `CountryHolidayView.tsx:328-351`
13. `<AdSlot />`

### Non-negotiables

- Internal links use `Link` from `@/i18n/navigation` with **locale-relative** hrefs:
  `` href={`/${country}/${year}/${slug}`} `` — as in `YearNav.tsx:33`.
  Do **not** copy `CountryHolidayView.tsx:394`, which passes an absolute
  `` `/${locale}/blog/...` `` into the localised `Link` and produces `/en/en/blog/...`.
- Every user-facing string comes from `messages/*.json` via `getTranslations("holidayDetail")`.
  No inline `locale === "zh" ? … : …` ternaries — `CountryHolidayView.tsx` does this in
  several places and it is why only 2 of 11 locales are actually served there.
- Icons from `lucide-react` only (ADR-002). No emoji.
- No gradients. Use `--brand` / `--border` / `--muted` / `--card` from `globals.css`.
- Dates: `new Date(d + "T00:00:00Z").toLocaleDateString(locale, { timeZone: "UTC", … })`.

---

## 9. Sitemaps

### 9a. `src/app/holidays/sitemap.ts` (new)

```ts
export const revalidate = 86400;

export const HOLIDAY_DETAIL_SITEMAP_LOCALES: readonly string[] = routing.locales;
// OPEN-DECISION 1: narrow to ["en","zh"] if GSC shows crawl-budget strain.
```

Algorithm:

1. `const year = new Date().getFullYear();`
2. For all `COUNTRIES`, fetch `getHolidays(code, year)` with a **concurrency cap of 10**
   using `Promise.allSettled`. A rejected or empty result removes that country entirely.
3. For each surviving country, `groupHolidays()` → one URL per group per locale in
   `HOLIDAY_DETAIL_SITEMAP_LOCALES`:
   `${SITE_URL}/${locale}/${code}/${year}/${slug}` ·
   `changeFrequency: "yearly"` · `priority: 0.6` · `lastModified: new Date()`
4. Current year only. Other years are reached via the prev/next links (§7) and `YearNav`.

Expected size ≈ **15 300** URLs at 11 locales / 103 data-bearing countries.
Add a dev-time `console.warn` if the array exceeds 45 000.

### 9b. `src/app/robots.ts` (edit)

```ts
sitemap: [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/blog/sitemap.xml`,
  `${SITE_URL}/holidays/sitemap.xml`,   // ADD
],
```

### 9c. `src/app/sitemap.ts` (edit, recommended)

The main sitemap is synchronous and lists all `COUNTRIES` unconditionally, so the
7 data-less countries contribute ~616 soft-error URLs. Cheapest correct fix: export a
`const NO_DATA_COUNTRIES = new Set(["IN","AE","TH","MY","TW","SA","IL"])` from
`src/lib/countries.ts` and filter on it. Revisit if a provider is added later
(ADR-001 OPEN-DECISION 3).

---

## 10. `src/lib/countries.ts` (edit)

### 10a. +64 country entries

Codes are in ADR-001 §7.2; all 64 verified to return 2026 data. Use the exact Nager
`name` string. Omit `nameZh` and `popular` (verified safe — `getCountryName` falls
back through `Intl.DisplayNames` then `c.name`, and `CountrySelector.tsx:45` renders
`c.name` only).

> While editing this file, normalise the formatting of the existing 46 entries —
> they are currently split awkwardly across lines with `\uXXXX` escapes. Convert to
> one entry per line with literal CJK characters. Verify the file is saved as UTF-8;
> the mojibake in `src/lib/seo.ts` suggests an encoding accident has happened here before.

### 10b. +64 demonyms

`getDemonym()` falls back to `c.name`, so a gap degrades "Kenyan public holidays" to
"Kenya public holidays". Fill all 64 — they are verifiable facts.

### 10c. Two new title helpers

```ts
export function getHolidayDetailTitle(
  holidayName: string, countryCode: string, locale: string, year: number
): string;

export function getHolidayDetailDescription(
  holidayName: string, countryCode: string, locale: string, year: number, dateLabel: string
): string;
```

English title: `When Is {holidayName} in {Country} in {year}? Date, Day & Details`
Other locales: the translated interrogative frame from
`messages/{locale}.json → holidayDetail.metaTitle`, with `{holidayName}` left in English
(ADR-001 §10.2).

---

## 11. `src/i18n/messages/*.json` — new `holidayDetail` namespace

Add to **all 11** files. Follow the ICU placeholder style already used in the
`country` namespace. Minimum key set:

```
metaTitle, metaDescription, h1Suffix,
answerBox, answerBoxMulti,
tableDate, tableWeekday, tableType, tableScope, tableFixed, tableSince,
scopeNational, scopeRegional, typePublic, typeOther,
fixedYes, fixedNo,
multiDateHeading, multiDateIntro,
regionsHeading, bridgeHeading,
bridgeLongWeekend, bridgeTakeMonday, bridgeTakeFriday, bridgeMidweek, bridgeWeekend,
adjacentHeading, prevYearLink, nextYearLink,
siblingsHeading, backToYear, backToCountry,
faqHeading, faqWhen, faqWhenAnswer, faqWhenAnswerMulti,
faqWeekday, faqWeekdayAnswer,
faqIsPublic, faqIsPublicNational, faqIsPublicRegional, faqIsPublicOther,
faqDaysUntil, faqDaysUntilFuture, faqDaysUntilPast,
faqRegions, faqRegionsAnswer,
faqBridge, faqBridgeAnswer,
emptyStateHeading, emptyStateBody
```

**Do not machine-translate holiday names.** Only the scaffolding is translated;
`{name}` is always interpolated as the English holiday name.

If a locale's translation is not ready, that is a blocker for shipping that locale in
the sitemap — not a licence to fall back to English silently.

---

## 12. Build order

1. `year-window.ts` → refactor `[year]/page.tsx` and `YearNav.tsx` to import it. Verify nothing regressed.
2. `types.ts` + `holidays.ts` 204 fix. Confirm `getHolidays("IN", 2026)` → `[]`.
3. `slug.ts` + `slug.test.ts`. **Green tests before anything renders.**
4. `holiday-facts.ts` + unit tests for the bridge/weekday matrix.
5. `seo.ts` additions + mojibake fix.
6. `countries.ts` expansion. Verify the homepage selector still renders and `POPULAR_COUNTRIES` is unchanged.
7. `lucide-react` install; swap the emoji in `CountryHolidayView.tsx` and `ThemeToggle.tsx`.
8. `messages/en.json` `holidayDetail` namespace, then the other 10.
9. `HolidaySiblingList.tsx` → `HolidayDetailView.tsx` → route file.
10. `holidays/sitemap.ts` + `robots.ts` + main-sitemap filter.
11. Full DoD sweep (ADR-001 §14 + ADR-002 DoD).

Steps 1–6 are backend-ish and independently verifiable; 7–11 are UI. If the work is
split across two people, that is the seam.

---

## 13. Do not do

- Do not add `generateStaticParams` to the new route (ADR-001 §11).
- Do not write prose about what a holiday *means*. If a holiday warrants narrative, it gets a hand-written post in `src/lib/blog-posts.ts` and the detail page links to it.
- Do not add a disambiguation suffix to slugs. Groups replace it (ADR-001 §3.3).
- Do not fabricate `Event.offers` / `performer` / venue to clear GSC warnings (ADR-001 §6.1).
- Do not add `OFFICIAL_SOURCES` entries without opening the government page and confirming it.
- Do not touch `TR`'s stored name (`"Turkey"` vs Nager's `"Türkiye"`) — it would change live titles and canonicals.
- Do not introduce a second icon library or any emoji in `src/app` / `src/components`.
