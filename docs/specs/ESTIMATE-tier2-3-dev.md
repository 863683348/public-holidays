# ESTIMATE — Tier 2 / Tier 3 development effort

**Author**: 高见远 (Chief Architect) · **Date**: 2026-08-07
**Basis**: codebase read at this date. Tier 1 (ADR-001/002 + SPEC-001) is **implemented
and QA-gated**; the 2 QA blocking fixes are in frontend's hands. Estimates below assume
that baseline is merged.
**Constraint**: existing stack only (Next.js 15 App Router + next-intl + Tailwind 3 +
lucide-react, already a dependency). No new frameworks.

Work units use the SPEC-001 split seam: **logic layer** (pure/`lib` + tests, backend-ish)
vs **UI layer** (routes/components/messages, frontend-ish). 1 person-day = 1 dev full day
including test + self-check.

---

## Current-state facts that shape every estimate

| Fact | Evidence |
|------|----------|
| Tier 1 already shipped: `[holiday]` route, `HolidayDetailView` + `HolidaySiblingList` + `HolidayFaq`, `slug.ts` + tests, `holiday-facts.ts` + tests, `year-window.ts`, `holidays/sitemap.ts`, 110-country expansion | files exist in `src/` |
| Detail page already has Event / EventList / Breadcrumb / FAQPage JSON-LD, question-style title, hreflang, canonical, 301 slug normalisation | `HolidayDetailView.tsx`, `[holiday]/page.tsx` |
| QA advisory (4 items) — current state: **2 done, 2 partial, 1 missing** | see T2-③ |
| Homepage already renders `<TodayHolidays countries={featured}>` for **only 8 popular countries**, `Promise.all` × (year, year+1) | `[locale]/page.tsx:11,22-35` |
| `TodayHolidays.tsx` is a **client** component; props `{code, holidays}[]`; computes today/next per country. Reusable as-is for `/today` | `TodayHolidays.tsx:15` |
| `WorldClock.tsx` is a client component; fetches `/api/holidays` per zone at runtime; 12 hard-coded majors; 1s ticker | `WorldClock.tsx:20-33,99-121` |
| `getHolidays(country, year)` is fetch-cached 90 d + ISR 24 h; `holidays/sitemap.ts` already uses a concurrency-capped `allSettled` pattern (execution safety precedent) | `holidays.ts`, `holidays/sitemap.ts` |
| Blog system: `BLOG_POSTS` (hand-written HTML content, `faq` field, `relatedCountries`), routes `blog/[category]/[slug]`, OG images are static SVGs under `/images/blog/*.svg`; **hardcoded English chrome + `next/link` + share buttons not localized** in the article page | `blog-posts.ts`, `blog/[category]/[slug]/page.tsx` |
| `longWeekend.ts` already computes long weekends + bridge days for a country-year | `longWeekend.ts` |
| `link-to-us` page: hardcoded English, **"46 Countries" stale** (now 110), emoji badges, not localized | `link-to-us/page.tsx` |
| Homepage "About PubHoliday" section is hardcoded English, not i18n'd | `[locale]/page.tsx:82-102` |
| `PricingClient.tsx` has a hand-rolled local `Check` SVG instead of lucide — inconsistent with ADR-002 | `PricingClient.tsx:7-13` |
| `/api/holidays?country=&year=` exists (per-country, cached) — usable by client components | `api/holidays/route.ts` |

---

# TIER 2

## T2-① `/compare` — multi-country holiday overlap dashboard

**Goal**: 2–6 country side-by-side calendar, highlight days where **everyone is off**
+ per-country long weekends. Shareable URL (`?c=US,GB,DE&y=2026`). Linkable asset.

### Scope

| Layer | Items |
|-------|-------|
| Route | `src/app/[locale]/compare/page.tsx` (server shell, ISR `revalidate=86400`, `robots: noindex` — query-param URL, not for indexation) |
| Logic (new `src/lib/compare.ts` + tests) | country/year param parse & validate; overlap-days computation (holiday set per country → dates present in ALL selected); "everyone off" list sorted; per-country long weekends reuse; share-URL encode/decode |
| Data | reuses `getHolidays` (fetch-cached). Default selection = 3 popular countries; year selector 2000–2035 via `year-window`. Cold render: 3–6 upstream calls (parallel, cached 90 d) — no new upstream |
| UI (client `CompareClient.tsx`) | country multi-select (reuse `CountrySelector` logic or a lighter chips variant), year switch, month grid with highlight columns, summary ("3 shared holidays in 2026"), share URL copy button, embed hint |
| i18n | new `compare` namespace × 11 (`title`, `subtitle`, `pickCountries`, `everyoneOff`, `sharedCount`, `noShared`, `share`, `copied`, …) ≈ 12–15 keys × 11 |
| Schema | none (noindex utility) |
| Sitemap | no addition (single URL per locale, noindex — same treatment as `world-clock`) |
| Tests | `compare.test.ts` (~8 cases: overlap, empty-overlap, param validation, share round-trip) |

### Effort

- Logic: **1–1.5 人日**（含测试）
- UI: **2–2.5 人日**
- **合计 3–4 人日**

### Dependencies / order

- Depends on **Tier 1 上线**（110 国数据 + getHolidays 缓存已就位；若 Tier 1 未上，compare 只能对 46 国）。
- Independent of T2-② and T2-③ → **可并行**。

### Risks / pitfalls

- **Data volume**: 6 国 × 全年 365 行 = fine for one client; but building the 365-day grid per country from `getHolidays` needs a month-days helper (UTC) — reuse pattern from `longWeekend.ts` (iterate year range, `isWeekend`).
- **"Everyone off" can be empty** for US+JP+DE (rare overlap). Design must render a useful empty state ("no shared days — here are the closest near-misses") or the page looks broken.
- **Share URL stability**: encode country codes upper-case + year; decode must be lenient (`getCountry` is case-insensitive). No server-side redirect needed; a malformed `c` param → fall back to defaults, never 400.
- **Noindex**: don't be tempted to index it; the query-param space is unbounded. Link it from homepage/footer as a tool.

### Designer handoff

- Month-grid highlight component (common-day cell vs country-cell) — 1 component spec
- Country chips multi-select (or reuse CountrySelector) — state + a11y spec
- Empty/near-miss state + share-URL bar
- Decide: full 12-month grid vs months-with-holidays filter (scope decision before build)

---

## T2-② PAA copy layer — question-style titles / FAQ across the site

**Goal**: capture "when is X" PAA queries everywhere the data supports it; align
non-EN titles with the native query phrasing (this is the site-wide "文案层改造").

### Scope

| Layer | Items |
|-------|-------|
| Titles (logic in `src/lib/countries.ts`) | add `getCompareTitle`, `getTodayTitle`, `getTodayDescription`, `getB2bTitle`…; **review `getHolidayPageTitle`/`getHolidayDetailTitle` for PAA alignment** — mostly done in Tier 1 for detail pages |
| Country-year FAQ | add a "when is the next … public holiday" question to the existing 5-item FAQ (`CountryHolidayView`) — reuses `nextHoliday` already computed |
| Messages | new/edited keys across **all 11** `messages/*.json` (title frames + ~4 FAQ keys). Translation risk: titles are the ranking surface — no machine-translate shortcuts |
| Existing hardcoded-EN remediation | `link-to-us` page (localize + fix stale "46 Countries" → 110 + replace emoji badges per ADR-002), homepage About section, blog article chrome (`blog/[category]/[slug]` hardcoded Home/Blog/By/Twitter/…), `PricingClient` local Check → lucide. **This is the bulk of the effort** — these are 4 files of mixed hardcoded EN |
| Schema | none new; FAQPage already emitted where FAQ exists |

### Effort

- Logic: **0.5–1 人日**（title helpers + FAQ key plumbing + tests minimal）
- UI/copy: **1.5–2 人日**（11 语言 messages + 4 file remediations）
- **合计 2–3 人日**

### Dependencies / order

- Independent of T2-①/③ → parallelizable with them. Depends on Tier 1 (title patterns now exist).
- **Do not** re-title pages that already rank (the report's own advice): keep existing country/year titles, only *add* PAA hooks. Ship the remediation (hardcoded EN) first — it's a prerequisite for any copy measurement.

### Risks / pitfalls

- **Language quality gate**: 11 languages × question frames — a typo in a `<title>` template is user-visible. Budget review time; consider shipping en+zh first, backfill the other 9.
- **Scope creep**: "整站文案层改造" is a phrase that could balloon. Constrain to: titles/descriptions helpers + country-year FAQ + the 4 known hardcoded-EN files. Everything else → separate ticket.

### Designer handoff

- None beyond a copy/tone pass; mostly content work. No new components.

---

## T2-③ QA advisory completion on the holiday detail page

**Goal**: close the 4 Tier-1 QA advisories. Current state vs checklist:

| Advisory | Status | Remaining |
|----------|--------|-----------|
| Verified adjacent-year links + next-occurrence FAQ | **Not built** | fetch year±1 (best-effort `allSettled`, 2 extra cached calls), render "next occurrence" FAQ when primary passed; render prev/next links only when slug verified |
| WebPage JSON-LD on detail page | **Not built** | add WebPage node (mirror `CountryHolidayView` shape, `mainEntity` → Event @id) |
| Regional partition list (counties → region names) | **Partial** | `counties` array is collected but not rendered as region names; add ISO-3166-2 → region-name mapping + table |
| Multi-date per-date weekday rows | **Partial** | `HolidayDetailView` renders date list only; add weekday column per date |

### Scope

- Logic: extend `holiday-facts.ts` (per-date weekday helper) + `seo.ts` (`webPageDetail`) + region-name mapping (small static map or `Intl.DisplayNames` region). Tests ~4.
- UI: extend `HolidayDetailView` + 1 small subcomponent (adjacent-year bar); keys × 11 in `holidayDetail` namespace (~6–8 new).
- Schema: WebPage (new on this page).

### Effort

- Logic: **0.5–1 人日**
- UI: **0.5–1 人日**
- **合计 1–2 人日**

### Dependencies / order

- Depends on Tier 1 merge (page exists). Independent of T2-①/②.

### Risks / pitfalls

- Adjacent-year fetch adds 2 upstream calls per cold render (already the Tier-1 design); keep `allSettled`, never block the page.
- Region-name mapping: `counties` are `AU-WA` style; `Intl.DisplayNames` gives "Western Australia" for many but not all — fall back to the raw code, don't fabricate.

---

## Tier 2 totals

**T2-① 3–4 + T2-② 2–3 + T2-③ 1–2 = 6–9 人日** (中位 ~7.5)

Parallelisable: T2-① ∥ T2-② ∥ T2-③ → wall-clock ≈ max(T2-①) ≈ **4 人日** + integration/QA buffer.
Suggest order for a 2-dev team: one dev takes T2-① (largest), the other T2-② then T2-③.

---

# TIER 3

## T3-① `/today` — real-time "who's off today" page

**Goal**: global "which countries have a public holiday today" + next-24h-zone view.
Already have: `TodayHolidays.tsx` (client, today + next per country) and `WorldClock.tsx`.

### Scope

| Layer | Items |
|-------|-------|
| Route | `src/app/[locale]/today/page.tsx` (server shell, ISR `revalidate=3600` — 1 h freshness), `robots: noindex` (daily-changing content, zero long-tail value) |
| Logic | **no new lib needed** — reuse `getHolidays` with concurrency cap (mirror `holidays/sitemap.ts` pattern); reuse `TodayHolidays` for the all-110 rendering (extend to accept >8, it already maps any array); a small "count of countries on holiday today" summary |
| UI | page shell + reuse `TodayHolidays` (full list) + `WorldClock` (existing) as two sections; optional "today's notable" highlight; timezone note ("dates shown in UTC") |
| i18n | new `today` namespace × 11 ≈ 6–8 keys |
| Schema | none (noindex) |
| Sitemap | no addition |
| Tests | minimal (date helper already covered); maybe 2 for count summary |

### Effort

- Logic: **0.5–1 人日**（数据装配）
- UI: **1–1.5 人日**
- **合计 1.5–2.5 人日**

### Dependencies / order

- Depends on Tier 1 (110-country data). Independent of T2 items → can run parallel.

### Risks / pitfalls

- **Timezone**: "today" differs per visitor. The data layer is UTC-midnight based (`holiday-dates.ts`, `holiday-facts.ts` already UTC-safe). For the Asia-Pacific edge (already "tomorrow" in UTC), render an explicit "as of {date} (UTC)" label rather than pretending.
- **Freshness vs cost**: `revalidate=3600` means a rebuild per hour for a noindex page; acceptable, but keep it out of any sitemap and keep `getHolidays` caching intact (the 90-d fetch cache means ~0 upstream traffic).
- **Reuse, don't rewrite**: `TodayHolidays`' client assumption (props) means the server fetches and passes `{code, holidays}[]` — same as homepage pattern. Don't convert it to server component; just feed it 110 entries.

### Designer handoff

- Section layout: two-column (today list / world clock) or stacked; "N countries off today" hero number; UTC disclaimer line. Small.

---

## T3-② Team / B2B narrative page

**Goal**: distributed-team / HR / remote-work persona page (competitor's "why teams
choose us"). Must not duplicate `/pricing` (commercial) or `/link-to-us` (link exchange).

### Scope

| Layer | Items |
|-------|-------|
| Route | `src/app/[locale]/for-teams/page.tsx` (static, ISR 86400) — indexable (unlike compare/today) |
| Content | static copy from `messages/*.json` (`forTeams` namespace ≈ 20–25 keys × 11): use cases (distributed time-off, cross-border paydays, shared calendars), long-weekend planning CTA, ICS/Pro upsell link, FAQ (4–6, with FAQPage schema) |
| Logic | reuse `faqPage`, `breadcrumb`, existing `SubscribeButton`; maybe a small "top long weekends this year" teaser computed from 3 featured countries (reuses `longWeekend.ts`) — optional, adds 0.5 d |
| i18n | as above; this is a copy-heavy page — the translation effort is the real cost |
| Schema | `WebPage` + `FAQPage` + `BreadcrumbList` (reuse helpers) |
| Sitemap | add `/for-teams` to the static-pages block in `src/app/sitemap.ts` |
| Tests | none (static) |

### Effort

- Logic: **0.5 人日**
- UI + copy: **1–1.5 人日**（含 11 语言）
- **合计 1.5–2 人日**

### Dependencies / order

- Independent of everything except Tier 1 merge. Parallelisable with T3-①/③.

### Risks / pitfalls

- **Positioning**: must sit between pricing (commercial, Pro plan) and link-to-us (partner/embed). The page's CTA should be "subscribe / try Pro for your team", not "upgrade" — avoid cannibalising the pricing funnel.
- **Content source**: no AI filler (P0). Write real, short value props; where a claim references data (e.g., "110 countries"), it must match `COUNTRIES.length` at render time — derive it, don't hardcode (the "46 Countries" staleness in link-to-us is the cautionary tale).
- Homepage About section could be refactored to link here (kills two birds with the T2-② remediation).

### Designer handoff

- Hero + 3 value blocks + testimonial placeholder + FAQ accordion + CTA band. One page template spec. Decide tone vs pricing (clean/brand vs trust/detail).

---

## T3-③ Long-weekend deep-dive blog cluster

**Goal**: content depth cluster (4–6 posts) around long weekends/bridge days per
country — the site's strongest differentiated data. Content-type, not feature.

### Scope

| Layer | Items |
|-------|-------|
| Data (logic) | `src/lib/long-weekend-content.ts` (+ tests): given country-year, produce a render-ready guide (all long weekends + bridge-day tables + "best months" summary). Reuses `findLongWeekends`. Pure, testable |
| Content | 4–6 hand-written posts in `BLOG_POSTS` (2–3 countries × 2 languages, e.g. en+zh), each with `faq`, `relatedCountries`, internal links to country-year + new detail pages, category reuse (`work`/`travel`) |
| OG images | 4–6 SVG under `/public/images/blog/` (existing pattern) — or a generator script |
| Schema | existing `Article` + `FAQPage` + breadcrumb already emitted by blog route — no change |
| Sitemap | automatic via existing `blog/sitemap.ts` |
| i18n | posts carry `locale` field (en/zh share slug) — existing model; blog chrome remediation from T2-② is a prerequisite for clean non-EN rendering |

### Effort

- Logic: **1 人日**（含测试）
- Content writing (4–6 posts, bilingual): **3–4 人日**（写作是主体）
- OG images: **0.5–1 人日**
- **合计 4.5–6 人日**

### Dependencies / order

- Depends on Tier 1 merge (internal links to detail pages); depends on **T2-② blog chrome remediation** for clean non-EN pages. Runs after/parallel-with T3-①/②.
- Content writing can start immediately once the data helper is stable — write the helper first, then parallelise writers.

### Risks / pitfalls

- **Scope**: "深度指南博客" can balloon. Fix at 4–6 posts / 2–3 countries for MVP; each post is reusable template. Don't try to cover 110 countries.
- **Duplicate-ish content**: each post must be country-specific (dates, region splits, bridge tables) — the data helper guarantees this. No generic "how to plan a long weekend" boilerplate across posts.
- **OG image pipeline**: hand-made SVGs are fine; a script that renders a country + year + top-3 weekends into an SVG is ~1 d but optional — do it only if the post count grows.

### Designer handoff

- Blog article template already exists. Needed: OG-image template spec (1 image that can be parameterised by country/year) — confirm whether the team wants the script or hand-made.

---

## Tier 3 totals

**T3-① 1.5–2.5 + T3-② 1.5–2 + T3-③ 4.5–6 = 7.5–10.5 人日** (中位 ~9)

Parallelisable: T3-① ∥ T3-② ∥ T3-③(helper first, then content). Wall-clock ≈ max(T3-③) ≈
**5–6 人日** + integration/QA.

---

# Aggregate

| Phase | 人日 range | 中位 | 关键依赖 |
|-------|-----------|------|----------|
| Tier 2 (①+②+③) | **6–9** | 7.5 | Tier 1 merge |
| Tier 3 (①+②+③) | **7.5–10.5** | 9 | Tier 2-② (blog chrome) for T3-③ |
| **Tier 2 + Tier 3** | **13.5–19.5** | ~16 | — |

2-dev parallel wall-clock: Tier 2 ≈ 4–5 d, then Tier 3 ≈ 5–6 d → **≈ 10–11 工作日** if
fully parallelised; realistically 2.5–3.5 周 with review/QA/designer latency.

## Cross-cutting risks (all phases)

1. **Translation gate** (T2-②/T3-②/T3-③ copy): 11 languages is the site's moat *and* its
   slowest lane. Budget translation review; ship en+zh first where copy is heavy.
2. **Noindex discipline**: compare + today are noindex tools. Keep them out of sitemaps;
   their value is links/engagement, not crawl.
3. **Upstream coupling**: compare (6 countries) and today (110 countries) multiply
   upstream fan-out on cold renders. Mitigation already exists: `getHolidays` fetch-cache
   (90 d) + ISR + concurrency-capped `allSettled`. If Vercel cold-start time is a concern,
   the `holidays/sitemap.ts` escape hatch (precomputed snapshot) applies here too.
4. **Existing-site debt encountered along the way** (must fix in the relevant PR, not
   separate tickets): `link-to-us` stale "46 Countries", emoji badges; `PricingClient`
   hand-rolled Check; hardcoded-EN chrome in blog article + homepage About.

## OPEN (needs team-lead/user decision)

- **O1** — /compare default selection + whether it embeds on the homepage (affects UI scope).
- **O2** — /today freshness: `revalidate=3600` acceptable, or 24 h (cheaper, "today" can be stale for half the planet in UTC terms)?
- **O3** — T3-③ post count & languages: 4 en+zh posts vs 6 posts × 3 languages (adds ~2 人日).
- **O4** — B2B page URL: `/for-teams` vs `/teams` vs `/business` (redirect cost if wrong later).
