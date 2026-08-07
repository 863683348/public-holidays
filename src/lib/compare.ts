import type { Holiday } from "./types";
import { parseYear } from "./year-window";
import { getCountry } from "./countries";
import { findLongWeekends } from "./longWeekend";

// Pure compare logic — no React, no I/O (holiday data is passed in).
// This is the unit-tested core; the /compare page just feeds it data.
// See SPEC-002 §1.

export const COMPARE_MIN = 2;
export const COMPARE_MAX = 6;
// O1: top-4 popular markets, not embedded on the homepage.
export const DEFAULT_SELECTION = ["US", "GB", "CA", "AU"];
export const DEFAULT_YEAR = new Date().getFullYear();

export interface CompareSelection {
  codes: string[];
  year: number;
}

/**
 * Parse `?c=US,GB,DE&y=2026`. `c` splits on `,`/`+`/whitespace (a `+` in a
 * hand-typed URL arrives URL-decoded as a space), each token is trimmed and
 * uppercased, empties dropped, duplicates removed. `y` must be an integer
 * inside the supported year window (see `year-window.ts`). Malformed input →
 * null → the caller falls back to defaults. NEVER throws.
 */
export function parseCompareParams(
  c: string | null,
  y: string | null
): CompareSelection | null {
  if (typeof c !== "string" || typeof y !== "string") return null;
  const year = parseYear(y);
  if (year === null) return null;

  const codes: string[] = [];
  for (const part of c.split(/[,+\s]+/)) {
    const code = part.trim().toUpperCase();
    if (!code) continue;
    if (!codes.includes(code)) codes.push(code);
  }
  if (codes.length === 0) return null;

  return { codes, year };
}

/**
 * Validate + dedupe codes against getCountry(); clamp year via parseYear.
 * Unknown codes are dropped; if the result is outside [COMPARE_MIN,
 * COMPARE_MAX] or the year is invalid → fall back to DEFAULT_SELECTION /
 * DEFAULT_YEAR. Lenient, never throws.
 */
export function resolveCompareSelection(
  codes: string[],
  year: number | null
): CompareSelection {
  const valid = [
    ...new Set(
      codes
        .map((code) => code.trim().toUpperCase())
        .filter((code) => code && getCountry(code) !== undefined)
    ),
  ];
  const resolvedYear =
    year !== null && parseYear(String(year)) !== null ? year : DEFAULT_YEAR;

  if (valid.length < COMPARE_MIN || valid.length > COMPARE_MAX) {
    return { codes: [...DEFAULT_SELECTION], year: DEFAULT_YEAR };
  }
  return { codes: valid, year: resolvedYear };
}

/** Month length in days, UTC-exact (Feb leap handled by day-zero trick). */
export function monthLength(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export interface CompareMatrix {
  year: number;
  countries: { code: string; name: string; holidays: Holiday[] }[];
  /** ISO dates present in EVERY selected country's holiday set. May be empty —
   *  the UI renders the near-miss state, not an error. */
  allOff: string[];
  /** Per-country long-weekend counts (reuse findLongWeekends). */
  longWeekendCounts: Record<string, number>;
}

export function computeCompareMatrix(
  countries: { code: string; name: string; holidays: Holiday[] }[],
  year: number
): CompareMatrix {
  // Match on the raw `Holiday.date` string, so no timezone can drift the
  // shared-date computation.
  const dateSets = countries.map((c) => new Set(c.holidays.map((h) => h.date)));

  const allOff: string[] = [];
  if (dateSets.length > 0) {
    const first = dateSets[0];
    for (const date of first) {
      if (dateSets.every((set) => set.has(date))) allOff.push(date);
    }
  }
  allOff.sort();

  const longWeekendCounts: Record<string, number> = {};
  for (const c of countries) {
    longWeekendCounts[c.code] = findLongWeekends(c.holidays, year).length;
  }

  return { year, countries, allOff, longWeekendCounts };
}

/**
 * Share URL: `${origin}/${locale}/compare?c=US,GB,DE&y=2026`. Trailing/leading
 * slashes on origin/locale are tolerated so callers can pass either
 * `https://site` or `https://site/` + `en` or `/en/`.
 */
export function encodeShareUrl(
  origin: string,
  locale: string,
  codes: string[],
  year: number
): string {
  const base = origin.replace(/\/+$/, "");
  const loc = locale.replace(/^\/+|\/+$/g, "");
  const c = [...new Set(codes.map((code) => code.toUpperCase()))].join(",");
  return `${base}/${loc}/compare?c=${c}&y=${year}`;
}
