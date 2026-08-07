import type { HolidayGroup } from "./types";

// Pure fact derivation — no I/O, no locale formatting. Every value here feeds a
// derived (never invented) sentence on the detail page. See ADR-001 §5.1.

export type BridgeAdvice =
  | "long-weekend"
  | "take-monday"
  | "take-friday"
  | "midweek"
  | "weekend";

export interface HolidayFacts {
  weekdayIndex: number; // 0=Sun .. 6=Sat, from primaryDate
  isWeekend: boolean;
  isFuture: boolean;
  daysUntil: number; // negative when past
  bridge: BridgeAdvice;
  scope: "national" | "regional" | "unknown";
  regionCount: number;
  isPublic: boolean; // types includes "Public"
  otherTypes: string[]; // types minus "Public"
  multiDate: boolean;
}

const MS_PER_DAY = 86_400_000;

/** Parse a YYYY-MM-DD string as UTC midnight. */
function toUtcDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

/** Weekday index (0=Sun..6=Sat) derived from the UTC date, timezone-safe. */
function utcWeekday(dateStr: string): number {
  return toUtcDate(dateStr).getUTCDay();
}

function bridgeFor(weekdayIndex: number): BridgeAdvice {
  switch (weekdayIndex) {
    case 1: // Monday
    case 5: // Friday
      return "long-weekend";
    case 2: // Tuesday
      return "take-monday";
    case 4: // Thursday
      return "take-friday";
    case 3: // Wednesday
      return "midweek";
    default: // 0 Sun / 6 Sat
      return "weekend";
  }
}

export function deriveHolidayFacts(
  group: HolidayGroup,
  today: Date
): HolidayFacts {
  const weekdayIndex = utcWeekday(group.primaryDate);
  const isWeekend = weekdayIndex === 0 || weekdayIndex === 6;

  // Compare at UTC-midnight granularity so the countdown never drifts by a day
  // depending on the server's timezone.
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const dateUtc = toUtcDate(group.primaryDate).getTime();
  const daysUntil = Math.round((dateUtc - todayUtc) / MS_PER_DAY);

  const scope: HolidayFacts["scope"] = group.global
    ? "national"
    : group.counties !== null
    ? "regional"
    : "unknown";
  const regionCount = group.counties?.length ?? 0;

  const isPublic = group.types.includes("Public");
  const otherTypes = group.types.filter((t) => t !== "Public");

  return {
    weekdayIndex,
    isWeekend,
    isFuture: daysUntil >= 0,
    daysUntil,
    bridge: bridgeFor(weekdayIndex),
    scope,
    regionCount,
    isPublic,
    otherTypes,
    multiDate: group.dates.length > 1,
  };
}
