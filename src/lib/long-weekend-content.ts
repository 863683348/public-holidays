import type { Holiday } from "./types";
import { findLongWeekends, type LongWeekend } from "./longWeekend";

/**
 * Render-ready long-weekend guide data for a country + year.
 *
 * This module is a thin, pure layer on top of `findLongWeekends` (see
 * `longWeekend.ts` for the full algorithm). It exists so the blog cluster
 * (T3-③) and any future "long weekends" UI can consume one stable shape
 * instead of re-deriving date spans and anchor holidays by hand.
 *
 * No network, no cache, no side effects — everything is derived from the
 * `Holiday[]` array passed in.
 */

export interface LongWeekendHoliday {
  date: string; // YYYY-MM-DD
  name: string; // English name from the upstream payload
  global: boolean; // true = observed nationwide
}

export interface LongWeekendGuideEntry extends LongWeekend {
  /** Every rest day in the span, inclusive (start..end), YYYY-MM-DD. */
  dates: string[];
  /** The public holidays that fall inside the span — i.e. the anchors. */
  holidays: LongWeekendHoliday[];
}

export interface LongWeekendGuide {
  countryCode: string; // ISO alpha-2, upper-case
  year: number;
  longWeekends: LongWeekendGuideEntry[];
  totalCount: number; // number of long weekends
  naturalCount: number; // no bridge day required
  bridgeCount: number; // one PTO day required to realise
  totalDays: number; // sum of `days` across all long weekends
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Inclusive list of dates from `start` to `end` (both YYYY-MM-DD). */
function spanDates(start: string, end: string): string[] {
  const out: string[] = [];
  const cur = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (cur <= last) {
    out.push(fmt(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/**
 * Build the render-ready guide for one country/year.
 *
 * `holidays` should be the full upstream holiday list for that country/year
 * (e.g. the result of `getHolidays(code, year)` or a fixture). All long
 * weekends are derived with `findLongWeekends`; each entry is enriched with
 * its constituent dates and the anchor holidays that fall inside the span.
 */
export function buildLongWeekendGuide(
  holidays: Holiday[],
  countryCode: string,
  year: number
): LongWeekendGuide {
  const base = findLongWeekends(holidays, year);

  const longWeekends: LongWeekendGuideEntry[] = base.map((lw) => {
    const span = new Set(spanDates(lw.start, lw.end));
    const anchors: LongWeekendHoliday[] = holidays
      .filter((h) => span.has(h.date))
      .map((h) => ({ date: h.date, name: h.name, global: h.global }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      ...lw,
      dates: spanDates(lw.start, lw.end),
      holidays: anchors,
    };
  });

  const naturalCount = longWeekends.filter((l) => !l.needBridge).length;
  const totalDays = longWeekends.reduce((sum, l) => sum + l.days, 0);

  return {
    countryCode,
    year,
    longWeekends,
    totalCount: longWeekends.length,
    naturalCount,
    bridgeCount: longWeekends.length - naturalCount,
    totalDays,
  };
}
