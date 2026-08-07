# ADR-001: Single-holiday detail route + country catalogue expansion

- **Status**: Proposed — awaiting sign-off on OPEN-DECISION 1/2/3
- **Date**: 2026-08-07
- **Author**: 高见远 (Chief Architect)
- **Scope**: Tier 1 SEO uplift for public-holidays.shop
- **Supersedes / Related**: ADR-002 (icon library, required by the same change)

---

## 1. Background

The site's finest content granularity today is the **country-year** page
(`/[locale]/[country]/[year]`, `src/app/[locale]/[country]/[year]/page.tsx`).
Competitor `worldholidays.me` publishes one page per **individual holiday**
(`/zh/holidays/{country}/{slug}/{year}`) and harvests the
`"[country] [holiday] [year]"` long tail plus the "When is …?" People-Also-Ask
block. We have no URL that can rank for `"good friday usa 2026"`.

Second gap: `COUNTRIES` in `src/lib/countries.ts` holds **46 entries** (not 64 —
see Correction C1), while Nager.Date exposes **204**.

### Evidence gathered during design (all measured, not assumed)

| # | Finding | Evidence |
|---|---------|----------|
| E1 | `COUNTRIES` has 46 entries, not 64 | `src/lib/countries.ts:5-98`, counted |
| E2 | Nager.Date `AvailableCountries` returns **204** entries | `GET https://date.nager.at/api/v3/AvailableCountries` |
| E3 | **7 of our 46 countries have no Nager data at all**: `IN, AE, TH, MY, TW, SA, IL` | `GET /PublicHolidays/2026/{code}` → HTTP **204 No Content** |
| E4 | Nager signals "no data" with **HTTP 204**, not 404. `res.ok` is `true` for 204, so `await res.json()` throws `SyntaxError` | `src/lib/holidays.ts:60-63` + live probe |
| E5 | **Duplicate holiday names are common, not rare** | US 2026: `Good Friday`×2, `Columbus Day`×2 · AU: `Labour Day`×4 · RU: `New Year Holiday`×5 · EG: `Eid al-Adha`×5 · KR: `Lunar New Year`×3 |
| E6 | Duplicates split into two distinct shapes (see §3.2) | US `Good Friday` = same date / different `counties`+`types`; AU `Labour Day` = **4 different dates**, one per state |
| E7 | Avg **13.8 unique holiday names** per country-year (35-country sample) | 513 raw records → 482 unique slugs |
| E8 | All 64 proposed new countries return 2026 data; avg 12.7 unique holidays | Batch probe, 64/64 OK |
| E9 | The API returns a `launchYear` field that our `Holiday` type drops | `src/lib/types.ts:1-10` vs live payload |
| E10 | Repo already runs **multiple sitemaps** (`src/app/sitemap.ts` + `src/app/blog/sitemap.ts`, registered in `src/app/robots.ts:13`) | — |
| E11 | Emoji used as functional UI icons in 3 files | See §8 |
| E12 | `src/lib/seo.ts:15` and `:106` contain **mojibake** (`${year}?????`, `"??????"`) — the zh strings were destroyed by an encoding round-trip | `src/lib/seo.ts` |

### Correction C1 — the brief's premises need adjusting

1. "64 countries" → actually **46**. The expansion is 46 → 110, i.e. +64 (coincidence of numbers).
2. "same-name holidays are extremely rare" → **wrong**, they occur in ~1/3 of countries (E5). The slug design below treats this as the primary case, not an edge case.
3. "sitemap ≈ 16.5k for 100 countries × 15 holidays" → close; measured figure is **≈14.9k** (103 data-bearing countries × 13.5 unique × 11 locales).

---

## 2. Decision summary

| # | Decision |
|---|----------|
| D1 | New route `src/app/[locale]/[country]/[year]/[holiday]/page.tsx`. Path order stays `country › year › holiday` (matches the existing hierarchy and the breadcrumb) rather than copying the competitor's `country/slug/year`. |
| D2 | Slug derives from the **English `name`** in every locale. New file `src/lib/slug.ts`. |
| D3 | **One page per unique slug, not per API record.** Records sharing a slug are *merged* into one `HolidayGroup`. No disambiguation suffix is ever needed. |
| D4 | Fix `getHolidays` to return `[]` on HTTP 204 instead of throwing. |
| D5 | `holidays.length === 0` → render an honest empty state, set `robots: noindex, follow`, exclude from sitemap. Covers E3 automatically. |
| D6 | Detail-page JSON-LD = `Event` (or `ItemList<Event>` for multi-date groups) + `FAQPage` + `BreadcrumbList` + `WebPage`, reusing `src/lib/seo.ts` helpers. |
| D7 | Holiday-detail URLs live in a **new third sitemap** `src/app/holidays/sitemap.ts` → `/holidays/sitemap.xml`, current year only, mirroring the existing `blog/sitemap.ts` pattern. |
| D8 | Historical/future years are discovered through **verified prev-year / next-year holiday links** rendered on every detail page, plus the "other holidays in this country-year" block. |
| D9 | Expand `COUNTRIES` 46 → 110 with a curated Tier-A list (§7), not all 204. |
| D10 | Keep the site's existing rendering model: **no `generateStaticParams`**, `export const revalidate = 86400`. |

---

## 3. Route & slug design

### 3.1 Route

```
src/app/[locale]/[country]/[year]/[holiday]/page.tsx
```

**Conflict audit** — no collision exists:

- Level-1 siblings of `[country]`: `account/ api/ blog/ contact/ faq/ link-to-us/ pricing/ privacy/ terms/ world-clock/` — all static, all win over the dynamic segment. No 2-letter ISO code collides.
- Level-2 siblings of `[year]`: `calendar.ics/route.ts` — static, wins.
- Level-3 under `[year]`: currently empty. `[holiday]` is the only child.

### 3.2 Slug rules — `src/lib/slug.ts` (new file)

Rationale for a new file rather than extending `src/lib/holidays.ts`: slugging is a
pure string/grouping concern with no network or cache dependency, and
`holidays.ts` is already the I/O module. Keeping them apart preserves single
responsibility and makes the slug logic trivially unit-testable (vitest is
already a devDependency).

```
slugifyHoliday(name: string): string
```

1. `String(name ?? "")`
2. `.normalize("NFKD")` then strip `[\u0300-\u036f]` — `Święto` → `Swieto`, `Día` → `Dia`
3. Delete apostrophes `' ’ ´ \`` **without inserting a separator** — `New Year's Day` → `new-years-day` (not `new-year-s-day`)
4. `&` → `-and-`
5. lowercase
6. any run of `[^a-z0-9]` → `-`
7. collapse `-{2,}` → `-`, trim leading/trailing `-`
8. truncate to 80 chars **at a `-` boundary**
9. if the result is empty → `"holiday"`

Slug is computed from `name` (always English in Nager's payload), **never** from
`localName`. This keeps one slug per holiday across all 11 locales so
`alternates.languages` maps 1:1 and hreflang stays valid.

### 3.3 Collision handling — merge, do not suffix

The brief assumed collisions are rare and asked for a suffix scheme. Evidence E5/E6
says otherwise, and a suffix would be the wrong answer anyway: two API records for
`Good Friday` in the US are *one* holiday that a searcher asks about once.

```ts
interface HolidayGroup {
  slug: string;
  name: string;            // English, from the first record
  localName: string;       // from the earliest-dated record
  dates: string[];         // ascending, de-duplicated. length >= 1
  primaryDate: string;     // dates[0]
  types: string[];         // union across records, de-duplicated
  counties: string[] | null; // union; null if ANY record is global
  global: boolean;         // true if ANY record is global
  fixed: boolean;          // true if ALL records are fixed
  launchYear: number | null;
  records: Holiday[];      // kept for rendering the per-region table
}

groupHolidays(holidays: Holiday[]): HolidayGroup[]   // ordered by primaryDate
findHolidayGroup(holidays: Holiday[], slug: string): HolidayGroup | null
```

The two real-world shapes both fall out of this:

- **Shape A — same name, different dates** (AU `Labour Day` 2026-03-02 / 03-09 / 05-04 / 10-05).
  `dates.length === 4`. The page answers *"Labour Day is observed on four
  different dates in Australia in 2026, depending on the state"* and lists each
  date with its states. This is strictly better content than a competitor page
  that picks one date, and it matches the actual query intent.
- **Shape B — same name, same date, different jurisdiction/type** (US `Good Friday`:
  10 states `Public` + Texas `Optional`). `dates.length === 1`, `counties` and
  `types` union to a single richer entity.

**Result: URLs are stable and suffix-free.** A suffix keyed on array index would
break every URL the day Nager adds or removes a record; a suffix keyed on date
would not disambiguate Shape B at all. Merging avoids both failure modes.

### 3.4 `notFound()` / redirect / noindex matrix

| Condition | Behaviour |
|-----------|-----------|
| `getCountry(country)` is `undefined` | `notFound()` |
| `year` not an integer, or outside **2000–2035** | `notFound()` |
| `country` param is not already upper-case | `permanentRedirect()` to the upper-case canonical path |
| `holiday` param is not already the canonical lower-case slug | `permanentRedirect()` to the canonical path |
| Upstream fetch throws (network / 5xx) | Render the existing `country.dataLag` fallback (transient — must **not** 404) |
| `holidays.length === 0` | Empty state + `robots: { index: false, follow: true }`; excluded from sitemap |
| Slug matches no group | `notFound()` |

Year bounds **must** be read from a single shared constant. Today `2000`/`2035` is
duplicated in `src/app/[locale]/[country]/[year]/page.tsx:10-11` and
`src/components/YearNav.tsx:18-19`. Extract to `src/lib/year-window.ts` and have all
three sites import it.

---

## 4. Data flow

One `getHolidays(country, year)` call powers the whole page:

```
holidays = await getHolidays(country, year)      // fetch-cached 90d + ISR 24h
groups   = groupHolidays(holidays)
target   = findHolidayGroup(holidays, slug)   → notFound() if null
siblings = groups.filter(g => g.slug !== slug)   // internal-link block, zero extra I/O
```

Two additional **best-effort** calls, both wrapped in `Promise.allSettled` and both
skippable without breaking the page:

```
prev = getHolidays(country, year - 1)   // if year-1 >= MIN_YEAR
next = getHolidays(country, year + 1)   // if year+1 <= MAX_YEAR
```

These exist to (a) answer the "when is it next year" FAQ and (b) render
**verified** prev/next-year links. Verification matters: rendering an unverified
`/{country}/{year+1}/{slug}` risks linking into `notFound()` when a holiday is
discontinued. Because `getHolidays` sits behind a 90-day fetch cache, this costs
three upstream calls only on a cold render.

If either settles as rejected, omit that link and that FAQ sentence. Never fail the page.

### 4.1 Required fix to `src/lib/holidays.ts`

```
// current, lines 60-63
if (!res.ok) throw new Error(...)
const data = await res.json()
```

`204 No Content` passes `res.ok` and then blows up in `res.json()` (E4). Add,
before the `res.json()` call:

```
if (res.status === 204) { await cache.put(key, "[]"); return []; }
```

This turns seven currently-broken countries (E3) from a thrown error into a clean,
`noindex`ed empty state, and stops the un-cached re-fetch storm those countries
cause on every request.

### 4.2 `Holiday` type gains `launchYear`

`src/lib/types.ts` — add `launchYear?: number | null;`. It is already in the wire
payload (E9) and gives the detail page a genuinely non-templated sentence
("observed as a public holiday since 2021"), which is exactly the kind of
differentiator that separates this from thin content.

---

## 5. Content model — how a page with no prose source avoids being thin

Nager ships structured fields only. Every sentence below is **derived**, never
invented. No LLM-written holiday history, no "Discover the rich cultural
significance of…" filler — that is precisely the AI-template register the team
bans, and Google's helpful-content systems treat it as a liability.

### 5.1 Derived facts available per group

| Fact | Source |
|------|--------|
| Weekday name, long date | `toLocaleDateString(locale, { weekday, year, month, day })` |
| Days until / days since | `primaryDate` vs today |
| Nationwide vs regional | `global`, `counties` |
| Holiday class | `types` (`Public` / `Bank` / `Optional` / `School` / `Authorities`) |
| Fixed vs moveable | `fixed` |
| Multi-date observance | `dates.length > 1` + per-region breakdown |
| Observed since | `launchYear` |
| Bridge-day opportunity | weekday: Tue → take Mon; Thu → take Fri; Mon/Fri → already a long weekend; Sat/Sun → no gain |
| Same holiday, adjacent years | verified `prev` / `next` lookups |
| Position in the year | rank among `groups` sorted by date |

### 5.2 Page sections

1. **H1** — `{name}` (+ `({localName})` when different) `— {Country} {year}`
2. **Answer box** — weekday + full date + days-until. This is the snippet target; it must be the first text node after H1.
3. **At-a-glance table** — Date / Weekday / Type / Scope (nationwide or *N* regions) / Fixed or moveable / Observed since
4. **Multi-date table** — only when `dates.length > 1`: date, weekday, regions
5. **Regional breakdown** — only when `counties` is non-null: the ISO-3166-2 list, rendered as region names
6. **Bridge-day note** — the weekday-derived advice above
7. **Same holiday in other years** — verified prev/next links
8. **Other public holidays in {Country} {year}** — the `siblings` list, each linking to its own detail page. *This is the core internal-link lever: ~13 outbound contextual links per page, ~14.9k pages, all mutually reinforcing.*
9. **Back-links** — to `/{country}/{year}` and `/{country}`
10. **FAQ** — §5.3
11. **Data provenance** — reuse the E-E-A-T block from `CountryHolidayView.tsx:328-351` (official source + last-updated)

### 5.3 FAQ — 4 to 6 entries, all data-derived

New `holidayDetail` namespace in all 11 `src/i18n/messages/*.json`.

| Key | Question | Answer shape |
|-----|----------|--------------|
| `faqWhen` | When is {name} in {country} in {year}? | `{name} falls on {weekday}, {longDate}.` — multi-date variant: `observed on {n} dates in {year}: {list}` |
| `faqWeekday` | What day of the week is {name} {year}? | `{weekday}.` + weekend/bridge remark |
| `faqIsPublic` | Is {name} a public holiday in {country}? | three branches: nationwide `Public` / regional (`n` regions, named) / non-`Public` type |
| `faqDaysUntil` | How many days until {name} {year}? | future: `{n} days from today ({today})` · past: `{name} {year} has passed; the next occurrence is {nextDate}` (needs `next`, omit sentence if unavailable) |
| `faqRegions` *(conditional)* | Which regions observe {name}? | rendered only when `counties` is non-null |
| `faqBridge` *(conditional)* | Can I make a long weekend around {name} {year}? | rendered only when the weekday yields a real answer |

### 5.4 Why this is not duplicate content

- **Across years, same country+holiday**: date, weekday, days-until, bridge-day advice, long-weekend eligibility, and the prev/next links all change. The FAQ answers change wording as a consequence, not as a template variable swap.
- **Across countries, same holiday**: date, regions, type, `launchYear`, and the entire siblings block differ.
- **Across locales**: country name (`getCountryName`), weekday and month names, date format, numeral system (Arabic locale), and all scaffolding copy are localised through `next-intl` + `Intl`.
- **Deliberately absent**: any generated narrative about a holiday's meaning or history. If a holiday deserves prose, it gets a hand-written blog post in `src/lib/blog-posts.ts` and the detail page links to it — never a machine-written paragraph.

---

## 6. Structured data

Reuse `breadcrumb()` and `faqPage()` from `src/lib/seo.ts` verbatim. Add
`holidayEvent()` to the same file.

### 6.1 Event — single-date group

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://public-holidays.shop/en/US/2026/good-friday#event",
  "url":  "https://public-holidays.shop/en/US/2026/good-friday",
  "name": "Good Friday",
  "alternateName": "Karfreitag",
  "startDate": "2026-04-03",
  "endDate": "2026-04-03",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "isAccessibleForFree": true,
  "inLanguage": "en",
  "location": {
    "@type": "Place",
    "name": "United States",
    "address": { "@type": "PostalAddress", "addressCountry": "US" }
  },
  "description": "Good Friday falls on Friday, 3 April 2026 in the United States."
}
```

- `alternateName` emitted **only** when `localName !== name` — mirrors the existing rule at `src/lib/seo.ts:23-25`.
- `location` is `Place` **with** a `PostalAddress` carrying `addressCountry`, rather than a bare `Country` node. Both validate, but Google's Event parser warns on a location without an address, and `addressCountry` is the one address field we can populate truthfully. No fabricated venue, no fabricated `offers`.
- **Honest expectation**: `Event` here is for entity disambiguation, not for Event rich results. Google's Event rich-result guidance targets ticketed/scheduled events with a venue and offers; a public holiday will not win an Event carousel. The rich-result upside on this page comes from `FAQPage` and `BreadcrumbList`. Ship `Event` for semantic clarity, and expect GSC to report it as "valid with warnings" — that is acceptable and must not be "fixed" by inventing `offers`.

### 6.2 Event — multi-date group

When `dates.length > 1`, emit an `ItemList` of `Event` nodes (one per date), matching
the existing `holidayItemList()` convention in `src/lib/seo.ts:6-29`:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Labour Day in Australia 2026",
  "itemListElement": [
    { "@type": "ListItem", "position": 1,
      "item": { "@type": "Event", "name": "Labour Day", "startDate": "2026-03-02",
                "eventStatus": "https://schema.org/EventScheduled",
                "location": { "@type": "Place", "name": "Western Australia",
                              "address": { "@type": "PostalAddress", "addressCountry": "AU",
                                           "addressRegion": "AU-WA" } } } }
  ]
}
```

`addressRegion` is populated from `counties` (already ISO-3166-2), so it is real data.

### 6.3 BreadcrumbList — 4 levels

`Home › {Country} Holidays › {year} › {Holiday name}`, built with the existing
`breadcrumb()` helper. Reuse the crumb-construction block from
`CountryHolidayView.tsx:160-169` and append the holiday crumb.

### 6.4 FAQPage + WebPage

`faqPage(faqItems)` unchanged. `WebPage` copies the shape at
`CountryHolidayView.tsx:202-231` with `mainEntity` pointing at the `Event` `@id`.

---

## 7. Country expansion: 46 → 110

### 7.1 Selection criteria

Nager exposes 204 codes (E2). Importing all 204 would add micro-territories
(Pitcairn, Tokelau, Niue, Svalbard, Cocos Islands, Norfolk Island, Wallis & Futuna…)
with negligible search demand and 5–8 holidays each — thousands of thin pages
against no upside. Inclusion rule:

> Sovereign state with population > ~1.5M, **or** a territory with material
> search demand (financial centre, major tourism market, large diaspora).

### 7.2 Tier A — 64 additions, all verified to return 2026 data (E8)

| Region | Codes |
|--------|-------|
| Europe (21) | `IS LU MT CY EE LV LT SI SK HR RS BA MK AL ME BG UA BY MD GE AM` |
| Asia-Pacific (6) | `VN KH BD MN KZ PG` |
| MENA (5) | `BH IQ MA DZ TN` |
| Sub-Saharan Africa (12) | `KE GH TZ UG ET ZW ZM MZ AO CM CI SN` |
| Americas (20) | `CL CO PE VE EC BO PY UY CR PA GT HN SV NI DO CU JM TT PR BS` |

46 + 64 = **110 entries**, of which **103 return data** (the 7 in E3 do not).

### 7.3 Field policy for new entries

- `name`: exactly the Nager `name` string, so `getCountry` stays in sync with the upstream vocabulary. Note `TR` is `"Türkiye"` upstream while we store `"Turkey"` — leave `TR` alone; changing it would alter existing titles and canonicals.
- `nameZh`: **omit**. Verified safe — `getCountryName()` (`src/lib/countries.ts:106-121`) falls back to `Intl.DisplayNames([locale], { type: "region" })` and only then to `c.name`. `CountrySelector.tsx` renders `c.name` exclusively and never touches `nameZh`. No `nameZh`-required call site exists.
- `popular`: **omit**. `POPULAR_COUNTRIES` (`countries.ts:220`) drives the homepage grid; growing it from 16 to 60 would dilute the landing page.
- `DEMONYMS` (`countries.ts:151-164`): `getDemonym()` already falls back to `c.name`, so a missing demonym degrades to "Kenya public holidays" instead of "Kenyan public holidays". Add demonyms for the 64 — they are trivially verifiable facts and unlock the adjective-form query set the map was built for.
- `OFFICIAL_SOURCES`: leave untouched. Only add a URL when a stable government page has actually been checked. Guessing here damages the E-E-A-T block it feeds.

### 7.4 Handling the 7 data-less countries (E3)

Keep `IN, AE, TH, MY, TW, SA, IL` in `COUNTRIES` — India alone is a large query
market and removing the entry would 404 URLs that already exist. With D4 + D5 they
render an honest empty state, are `noindex`ed, and drop out of every sitemap.
That removes ~616 soft-error URLs (7 × 8 pages × 11 locales) that are in
`sitemap.xml` today. See OPEN-DECISION 3.

---

## 8. P0 compliance

### 8.1 Rules applied to the new work

- **No emoji as functional icons** — the new page uses the icon library locked in ADR-002 (`lucide-react`). Icons needed: `CalendarDays`, `MapPin`, `ChevronLeft`, `ChevronRight`, `Info`, `Clock`.
- **No purple→pink gradient** — the new page inherits `--brand` / `--border` / `--muted` from `globals.css`; no new gradients are introduced.
- **No AI-template copy** — enforced structurally by §5.4: the page has no free-text field that a model could fill. Every string is either a derived fact or a translated scaffold in `messages/*.json`.

### 8.2 Existing violations found (E11)

| File | Line | Token | Severity |
|------|------|-------|----------|
| `src/components/CountryHolidayView.tsx` | 256 | `📅` (next-holiday card icon, `aria-hidden`) | **Blocking** — functional UI icon |
| `src/components/ThemeToggle.tsx` | 27 | `☀` / `☾` (theme toggle) | **Blocking** — functional UI icon |
| `src/app/[locale]/link-to-us/page.tsx` | 111, 154, 158, 162, 166 | `📅 ✈️ 🏢 🌐 📚` (section icons) | **Blocking** — functional UI icons |
| `src/app/[locale]/link-to-us/page.tsx` | 195–199 | `✅` / `❌` (list bullets) | **Blocking** — semantic bullets, replace with `Check` / `X` |
| `src/lib/blog-posts.ts` | 274, 297, 333, 360, 774, 786, 789, 792, 965, 983-989, 1054, 1072-1078 | `🥇🥈🥉📊⚠️` inside article HTML | **Advisory** — editorial body copy, not UI chrome. Out of Tier-1 scope; schedule separately. |

`CountryHolidayView.tsx:256` sits directly in the Tier-1 blast radius (the detail
page reuses its patterns) and should be fixed in the same PR.

### 8.3 Unrelated defect found (E12)

`src/lib/seo.ts:15` emits `` `${countryName} ${year}?????` `` and `:106` emits
`"??????"` for the `zh` locale — the Chinese source strings were destroyed by an
encoding round-trip. This currently ships question marks into the `ItemList.name`
and `Article.publisher.name` of every Chinese page. Not caused by this change, but
it is in a file this change edits. Fix in the same PR: `公共假期` and `公众假期网`
respectively (confirm the brand string against `messages/zh.json → site.title`).

---

## 9. Sitemap strategy

### 9.1 Structure

Add `src/app/holidays/sitemap.ts` → `/holidays/sitemap.xml`, mirroring the proven
`src/app/blog/sitemap.ts` pattern (E10), and register it in `src/app/robots.ts:13`.

Rationale for a third file over appending to `src/app/sitemap.ts`: it keeps each
document far below the 50 000-URL / 50 MB limits, isolates a network-dependent
sitemap from two purely static ones, and lets the holiday sitemap carry its own
`revalidate` without changing the cadence of the others.

The root-level `holidays/` directory does not shadow `[locale]` — it contains only
`sitemap.ts`, exactly as `blog/` does today, and next-intl middleware handles
`/holidays` as a locale-less path the same way it handles `/blog`.

### 9.2 Contents — current year only

```
for locale of routing.locales           // 11
  for country of COUNTRIES              // 110, minus those returning []
    for group of groupHolidays(await getHolidays(country, currentYear))
      → ${SITE_URL}/${locale}/${country.code}/${currentYear}/${group.slug}
        changeFrequency: "yearly", priority: 0.6, lastModified: new Date()
```

### 9.3 Volume — measured, not estimated

| Sitemap | URLs |
|---------|------|
| `/sitemap.xml` (110 countries) | 11 × (8 static + 110 × 8) ≈ **9 770** + blog rows |
| `/blog/sitemap.xml` | unchanged, low hundreds |
| `/holidays/sitemap.xml` | 103 data-bearing countries × 13.5 unique groups × 11 locales ≈ **15 300** |
| **Total** | **≈ 25 000**, spread over three documents, each < 16 k |

Comfortably inside the 50 000-URL cap with room for a further year of growth.
The brief's ~16.5k / ~25k figures are confirmed; the per-country multiplier is
13.5 unique groups rather than 15 raw records, because of the merge in D3.

### 9.4 Execution safety

- `export const revalidate = 86400;` on the sitemap route.
- Fetch with a **concurrency cap of 10** and `Promise.allSettled`; a rejected country is skipped, never fatal. Sequential 110 calls would exceed the platform function timeout; unbounded parallelism would risk upstream rate-limiting.
- After warm-up the 90-day fetch cache in `getHolidays` makes this nearly free.
- Escape hatch if the route still times out on cold start: precompute
  `src/lib/holiday-slugs.generated.json` from a `scripts/` job (the directory already
  exists) and read it synchronously. Deliberately **not** the default — it adds an
  annual maintenance step and can drift from live data, and the current
  on-demand-ISR model has no build-time data dependency anywhere. Adopt only on evidence.

### 9.5 Why current-year-only is sufficient

Years 2000–2035 stay reachable without being listed:

1. Every detail page links to the **verified** same-holiday page in year−1 and year+1 (D8) — a continuous chain Googlebot can walk in both directions.
2. `YearNav` (`src/components/YearNav.tsx`) already exposes a 4-year window on every country-year page, and those pages are in the main sitemap for year−1..year+5.
3. Each detail page links to ~13 sibling holidays in the same country-year.

This matches the philosophy already written into `src/app/sitemap.ts:11-12`.

---

## 10. i18n, titles, canonicals

### 10.1 Internal links

All internal links use `Link` from `@/i18n/navigation` with locale-relative hrefs —
`` href={`/${country}/${year}/${slug}`} `` — matching `YearNav.tsx:33`. Note the
existing bug at `CountryHolidayView.tsx:394`, which passes an absolute
`` `/${locale}/blog/...` `` to the localised `Link` and yields a doubled locale
prefix (`/en/en/blog/...`). Do not copy that pattern; flagged as advisory.

### 10.2 Which name to display

| Surface | Rule |
|---------|------|
| URL slug | English `name`, always, in every locale (D2) |
| `<h1>` and `<title>` | English `name`, with `({localName})` appended when different |
| `Event.name` | English `name`; `alternateName` = `localName` when different |
| Country name | `getCountryName(code, locale)` — localised |
| Dates, weekdays, months | `toLocaleDateString(locale, …)` — localised |
| All scaffolding copy | `next-intl` from `messages/{locale}.json` |

**Why the holiday name stays English in non-English locales.** `localName` is the
name in the *country's* language, not the *reader's* — showing `설날` to a Spanish
reader is not a Spanish translation, it is Korean. We have no translated holiday-name
corpus for 11 locales × ~1 400 holidays, and machine-generating one would put
unverified strings into `<h1>` and `Event.name`. Rendering `Lunar New Year (설날)`
is accurate in every locale. Revisit only with a curated translation table.

### 10.3 Title and description

English:

```
When Is {Name} in {Country} in {Year}? Date, Day & Details
```

`"When Is Good Friday in the United States in 2026?"` is 48 characters, leaving room
for the layout's brand suffix. The interrogative form mirrors the PAA phrasing the
page is built to capture.

Non-English: keep the same interrogative frame, translated per locale in
`messages/*.json → holidayDetail.metaTitle`, with `{name}` still English:

```
zh: {name}（{country}）{year}年是哪一天？日期与放假安排
```

Add `getHolidayDetailTitle()` / `getHolidayDetailDescription()` to
`src/lib/countries.ts`, alongside the existing `getHolidayPageTitle` /
`getHolidayPageDescription` (`countries.ts:172-198`), so all title logic stays in one
module.

### 10.4 Canonical and hreflang

Exactly mirrors `[year]/page.tsx:34-43`:

```ts
const languages: Record<string, string> = {};
for (const l of routing.locales)
  languages[l] = `${SITE_URL}/${l}/${COUNTRY_UPPER}/${y}/${slug}`;

alternates: {
  canonical: `${SITE_URL}/${locale}/${COUNTRY_UPPER}/${y}/${slug}`,
  languages: { ...languages, "x-default": `${SITE_URL}/en/${COUNTRY_UPPER}/${y}/${slug}` },
}
```

Because the slug is locale-invariant (D2), the 11 alternates are a clean 1:1 cluster.

`generateMetadata` must **not** call `getHolidays` for the happy path if it can be
avoided — but it does need the slug to exist for a correct canonical. Since the fetch
is cached and shared with the page render within the same request, calling
`getHolidays` in both is acceptable; Next.js dedupes identical `fetch` calls per
request. Also set `robots: { index: false, follow: true }` from `generateMetadata`
when the group is missing or `holidays.length === 0`.

---

## 11. Rendering model

Keep exactly what the site already does (`[year]/page.tsx:19-21`,
`[country]/page.tsx:8-11`):

```ts
export const revalidate = 86400;
// no generateStaticParams
```

`generateStaticParams` is the wrong tool here: 11 × 110 × 36 × ~13 ≈ 566 000
combinations. Even restricted to the current year it is ~15 000 pages, each needing
an upstream call at build time — minutes of build, and it reintroduces the
`DYNAMIC_SERVER_USAGE` class of failure the existing comments say was already hit.
On-demand ISR renders each page once on first request and caches for 24 h; the
90-day `fetch` cache means the upstream is hit roughly once per country-year.

---

## 12. Consequences

**Positive**

- ~1 400 new indexable URLs per locale-year targeting `"[country] [holiday] [year]"`, closing the single largest gap against `worldholidays.me`.
- ~13 contextual internal links per new page, meaningfully increasing crawl depth and internal PageRank flow into country-year pages.
- FAQ + interrogative titles are aimed at PAA and featured snippets, where a one-sentence factual answer competes well.
- Country coverage 46 → 110 (103 with data) roughly doubles the addressable query surface.
- Two live defects fixed as a side effect: the 204 crash (E4) and ~616 soft-error sitemap URLs (E3).

**Negative / accepted**

- Upstream dependency on Nager.Date deepens. Mitigated by the 90-day fetch cache, the filesystem cache, and the graceful `dataLag` path — but a prolonged outage now degrades far more pages.
- Non-English detail pages carry an English `<h1>` holiday name (§10.2). Accepted deliberately; the alternative is fabricated translations.
- Sitemap render becomes network-dependent. Mitigated by ISR + `allSettled` + the documented static-snapshot escape hatch.
- 3 upstream calls on a cold detail-page render instead of 1, to keep prev/next links verified.
- Total indexable URLs roughly triple. If Google Search Console shows crawl-budget strain or a rising "Discovered – currently not indexed" bucket, the locale set in the holiday sitemap is the throttle (see OPEN-DECISION 1).

---

## 13. Open decisions

**OPEN-DECISION 1 — locale breadth of the holiday sitemap.**
Shipping all 11 locales lists ~15 300 detail URLs at once, in a locale set where 9 of
11 carry an English `<h1>`. The conservative alternative is `en` + `zh` only
(~2 800 URLs), with the other 9 locales still routable and still present in `hreflang`,
added to the sitemap once indexation is proven.
*Recommendation:* implement `HOLIDAY_DETAIL_SITEMAP_LOCALES` as an exported constant
in `src/app/holidays/sitemap.ts`, default it to all 11, and review GSC coverage at
week 4. Explicit knob, no premature optimisation.
**Needs: team-lead / user sign-off.**

**OPEN-DECISION 2 — prev/next-year link verification.**
Verified links cost 2 extra upstream calls per cold render; unverified links cost
nothing but can point at `notFound()`. Recommendation: verify (correctness over a
cold-start millisecond, and the calls are cached). Reversible either way.
**Needs: acknowledgement only.**

**OPEN-DECISION 3 — the 7 data-less countries.**
`IN, AE, TH, MY, TW, SA, IL` will render `noindex` empty states. India, Thailand,
Malaysia, Israel and UAE are substantial query markets. Options: (a) leave
`noindex` as designed; (b) source a second provider for these; (c) hand-curate their
holiday tables into a local data file. (a) is correct for Tier 1; (b)/(c) are a
Tier-2 content project worth scoping.
**Needs: user decision on whether to scope Tier 2.**

**OPEN-DECISION 4 — country-code casing.**
Existing URLs use upper-case codes (`/en/US/2026`), but `getCountry` is
case-insensitive, so `/en/us/2026` renders today with a self-referencing lower-case
canonical — a pre-existing duplicate-content path on the year and country pages. The
new route normalises via `permanentRedirect`. Applying the same normalisation to the
two existing routes is a one-line change but touches live URLs.
*Recommendation:* do it, in a separate PR, after this ships.
**Needs: team-lead scheduling decision.**

---

## 14. Verification checklist (Definition of Done)

1. `npx tsc --noEmit` clean.
2. Unit tests (vitest, already a devDependency) for `src/lib/slug.ts`:
   `New Year's Day → new-years-day`; `Święto Konstytucji 3 Maja → swieto-konstytucji-3-maja`;
   `""` → `holiday`; US 2026 → exactly 15 groups; AU 2026 `labour-day` → one group with 4 dates;
   US 2026 `good-friday` → one group, 1 date, counties union of 11 entries, types `["Public","Optional"]`.
3. `getHolidays("IN", 2026)` resolves to `[]` and does not throw.
4. Live spot-checks: `/en/US/2026/good-friday` (Shape B), `/en/AU/2026/labour-day` (Shape A, 4 dates), `/zh/JP/2026/new-years-day` (localised chrome, English holiday name), `/en/IN/2026/anything` → `notFound()`, `/en/IN/2026` → empty state + `noindex`.
5. Rich Results Test passes `FAQPage` and `BreadcrumbList` on a detail page; `Event` may show warnings — acceptable per §6.1.
6. `/holidays/sitemap.xml` returns 200, contains no URL for a data-less country, and totals under 20 000 entries.
7. `/robots.txt` lists all three sitemaps.
8. Emoji grep over `src/app` and `src/components` returns zero hits.
9. Every one of the 11 `messages/*.json` files has a complete `holidayDetail` namespace — no key falls back to English silently.
