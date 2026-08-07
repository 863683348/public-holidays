# ADR-002: Lock `lucide-react` as the single SVG icon library

- **Status**: Proposed
- **Date**: 2026-08-07
- **Author**: 高见远 (Chief Architect)
- **Related**: ADR-001 (the holiday detail page is the first consumer)

---

## Background

Team P0 rule: emoji must not be used as functional icons, and the project must lock
exactly one SVG icon library so the whole codebase stays visually consistent.

`package.json` currently declares **no icon dependency**. The gap has been filled
with emoji, which are inconsistent across platforms (Windows/macOS/Android render
`📅` very differently), unstyleable (no `currentColor`, no stroke weight), and
inaccessible without manual `aria-hidden` plumbing.

Audit of current functional-icon emoji (line references as of 2026-08-07):

| File | Line | Token | Purpose |
|------|------|-------|---------|
| `src/components/CountryHolidayView.tsx` | 256 | `📅` | Next-holiday card icon |
| `src/components/ThemeToggle.tsx` | 27 | `☀` / `☾` | Light / dark toggle |
| `src/app/[locale]/link-to-us/page.tsx` | 111 | `📅` | Badge preview |
| `src/app/[locale]/link-to-us/page.tsx` | 154, 158, 162, 166 | `✈️ 🏢 🌐 📚` | Section headings |
| `src/app/[locale]/link-to-us/page.tsx` | 195–199 | `✅` / `❌` | Permitted / prohibited list markers |

Emoji inside `src/lib/blog-posts.ts` article bodies (`🥇🥈🥉📊⚠️`) are editorial
prose, not UI chrome, and are out of scope for this ADR.

---

## Options considered

| Option | Bundle cost | React 19 | Coverage | Verdict |
|--------|-------------|----------|----------|---------|
| **`lucide-react`** | tree-shakeable, ~0.6–1 KB per icon used | `peerDependencies.react` includes `^19.0.0` (verified on v1.29.0) | ~1 600 icons | **Chosen** |
| `@heroicons/react` | tree-shakeable, similar | yes | ~300 icons | Viable, but thinner set; no calendar/region variants we need |
| `react-icons` | poor tree-shaking historically; pulls multiple icon sets | yes | huge | Rejected — mixes design languages, defeats "one library" |
| Hand-written local SVG components | 0 KB dependency | n/a | only what we draw | Rejected — see below |

**Why not hand-written SVGs.** With ~8 icons today it is tempting, and the bundle
argument favours it. It was rejected because P0 asks for a *locked library*, and a
folder of ad-hoc SVGs is the opposite: nothing enforces a consistent 24×24 grid,
1.5px stroke, or `currentColor`, and every new icon becomes a design decision made
by whoever is writing the component that day. `lucide-react` gives that consistency
for free and the tree-shaken cost of 8 icons is under 8 KB.

**Why not `@heroicons/react`.** Genuinely close. `lucide-react` wins on set size
(we need `MapPin`, `CalendarDays`, `CalendarClock`, `Landmark` — several are absent
or awkward in Heroicons) and on stroke-width control via a plain `strokeWidth` prop.

---

## Decision

Add `lucide-react` (`^1.29.0`) to `dependencies`. It is the **only** icon source
permitted in `src/app` and `src/components`.

### Usage rules

1. Import named icons only — `import { CalendarDays } from "lucide-react"` — never
   the barrel default. Named imports are what makes tree-shaking work.
2. Default props: `size={20}`, `strokeWidth={1.75}`, colour inherited via
   `currentColor`. Do not hard-code `stroke`/`fill`.
3. Decorative icon → `aria-hidden` and the adjacent text carries the meaning.
   Icon-only control → `aria-label` on the interactive element, not on the SVG.
4. Icons render fine in Server Components; add `"use client"` only if the
   surrounding component already needs it.
5. No emoji in `src/app` or `src/components`. Enforced by the grep in the DoD below.

### Icon map for the ADR-001 work and the emoji replacements

| Use | Icon |
|-----|------|
| Next-holiday card, date fields | `CalendarDays` |
| Days-until / countdown | `CalendarClock` |
| Region / county scope | `MapPin` |
| Previous / next year navigation | `ChevronLeft` / `ChevronRight` |
| Data-provenance note | `Info` |
| Theme toggle | `Sun` / `Moon` |
| Permitted list marker | `Check` |
| Prohibited list marker | `X` |
| Travel section | `Plane` |
| HR / business section | `Building2` |
| Directories section | `Globe` |
| Education section | `GraduationCap` |

---

## Consequences

**Positive** — one visual language; `currentColor` means icons follow the existing
`next-themes` light/dark switch with no extra work; accessibility handled by
convention rather than per-site improvisation; P0 satisfied.

**Negative** — one new runtime dependency and one more upgrade to track. Icons now
ship as React components, so a page that previously rendered a text glyph now
mounts a small SVG tree; immaterial at this page's component count.

**Migration** — replacing the emoji in `CountryHolidayView.tsx` and `ThemeToggle.tsx`
belongs in the ADR-001 PR (both are in its blast radius). `link-to-us/page.tsx` can
follow in a small separate PR.

---

## Definition of Done

1. `lucide-react` present in `package.json` `dependencies`.
2. `npx tsc --noEmit` clean.
3. Emoji grep over UI source returns zero hits:
   `grep -rnP '[\x{1F300}-\x{1F9FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]' src/app src/components`
4. Theme toggle keeps an accessible name after the `Sun`/`Moon` swap.
5. Visual check in both light and dark themes.
