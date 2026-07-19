import type { Holiday } from "./types";

export interface LongWeekend {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  days: number;
  needBridge: boolean; // true = must take 1 PTO day to realize it
  bridgeDay?: string; // the workday to take off
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

function isWeekend(d: Date): boolean {
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}

// Given any day in a weekend, return the Saturday of that weekend.
function startOfWeekend(d: Date): Date {
  return isWeekend(d) && d.getUTCDay() === 0 ? addDays(d, -1) : d;
}

// Given any day in a weekend, return the Sunday of that weekend.
function endOfWeekend(d: Date): Date {
  return isWeekend(d) && d.getUTCDay() === 6 ? addDays(d, 1) : d;
}

/**
 * Find long weekends for a country/year.
 * - Natural runs: 3+ consecutive rest days (weekends + holidays), e.g. holiday clusters.
 * - Bridge opportunities: a weekday holiday directly adjacent to a weekend across a
 *   single workday; taking that workday off yields a 4+ day break.
 */
export function findLongWeekends(
  holidays: Holiday[],
  year: number
): LongWeekend[] {
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31));

  const rest = new Set<string>();
  for (let t = yearStart.getTime(); t <= yearEnd.getTime(); t += 86_400_000) {
    const dt = new Date(t);
    if (isWeekend(dt)) rest.add(fmt(dt));
  }
  for (const h of holidays) rest.add(h.date);

  const out: LongWeekend[] = [];

  // 1) Natural consecutive rest runs (>= 3 days)
  let cur = new Date(yearStart);
  while (cur <= yearEnd) {
    const k = fmt(cur);
    if (rest.has(k)) {
      let end = new Date(cur);
      let nxt = addDays(end, 1);
      while (nxt <= yearEnd && rest.has(fmt(nxt))) {
        end = nxt;
        nxt = addDays(end, 1);
      }
      const days = diffDays(end, cur) + 1;
      if (days >= 3) {
        out.push({ start: fmt(cur), end: fmt(end), days, needBridge: false });
      }
      cur = addDays(end, 1);
    } else {
      cur = addDays(cur, 1);
    }
  }

  // 2) Bridge-day opportunities (weekday holiday next to a weekend, 1 workday gap)
  for (const h of holidays) {
    const hd = new Date(`${h.date}T00:00:00Z`);
    if (isWeekend(hd)) continue;

    const prev = addDays(hd, -1);
    const prev2 = addDays(hd, -2);
    if (!rest.has(fmt(prev)) && isWeekend(prev2)) {
      const start = startOfWeekend(prev2);
      out.push({
        start: fmt(start),
        end: h.date,
        days: diffDays(hd, start) + 1,
        needBridge: true,
        bridgeDay: fmt(prev),
      });
    }

    const nxt = addDays(hd, 1);
    const nxt2 = addDays(hd, 2);
    if (!rest.has(fmt(nxt)) && isWeekend(nxt2)) {
      const end = endOfWeekend(nxt2);
      out.push({
        start: h.date,
        end: fmt(end),
        days: diffDays(end, hd) + 1,
        needBridge: true,
        bridgeDay: fmt(nxt),
      });
    }
  }

  out.sort((a, b) => a.start.localeCompare(b.start));
  return out;
}
