import { describe, it, expect } from "vitest";
import { deriveHolidayFacts } from "./holiday-facts";
import type { HolidayGroup } from "./types";

function makeGroup(overrides: Partial<HolidayGroup>): HolidayGroup {
  return {
    slug: "test",
    name: "Test",
    localName: "Test",
    dates: ["2026-06-10"],
    primaryDate: "2026-06-10",
    types: ["Public"],
    counties: null,
    global: true,
    fixed: true,
    launchYear: null,
    records: [],
    ...overrides,
  };
}

describe("deriveHolidayFacts — bridge/weekday matrix", () => {
  // 2026-06 weekday reference (UTC): 08 Mon, 09 Tue, 10 Wed, 11 Thu, 12 Fri, 13 Sat, 14 Sun
  it.each([
    ["2026-06-08", 1, "long-weekend", false], // Monday
    ["2026-06-09", 2, "take-monday", false], // Tuesday
    ["2026-06-10", 3, "midweek", false], // Wednesday
    ["2026-06-11", 4, "take-friday", false], // Thursday
    ["2026-06-12", 5, "long-weekend", false], // Friday
    ["2026-06-13", 6, "weekend", true], // Saturday
    ["2026-06-14", 0, "weekend", true], // Sunday
  ])("%s -> weekday %i, bridge %s", (date, weekdayIndex, bridge, isWeekend) => {
    const facts = deriveHolidayFacts(
      makeGroup({ dates: [date as string], primaryDate: date as string }),
      new Date("2026-01-01T00:00:00Z")
    );
    expect(facts.weekdayIndex).toBe(weekdayIndex);
    expect(facts.bridge).toBe(bridge);
    expect(facts.isWeekend).toBe(isWeekend);
  });

  it("parses the weekday in UTC regardless of server timezone", () => {
    // 2026-01-01 is a Thursday in UTC. A naive local-time parse could shift it.
    const facts = deriveHolidayFacts(
      makeGroup({ dates: ["2026-01-01"], primaryDate: "2026-01-01" }),
      new Date("2025-12-01T00:00:00Z")
    );
    expect(facts.weekdayIndex).toBe(4);
  });
});

describe("deriveHolidayFacts — countdown", () => {
  it("counts future days from today", () => {
    const facts = deriveHolidayFacts(
      makeGroup({ dates: ["2026-06-10"], primaryDate: "2026-06-10" }),
      new Date("2026-06-01T12:00:00Z")
    );
    expect(facts.daysUntil).toBe(9);
    expect(facts.isFuture).toBe(true);
  });

  it("is negative for a past holiday", () => {
    const facts = deriveHolidayFacts(
      makeGroup({ dates: ["2026-06-10"], primaryDate: "2026-06-10" }),
      new Date("2026-06-20T00:00:00Z")
    );
    expect(facts.daysUntil).toBe(-10);
    expect(facts.isFuture).toBe(false);
  });

  it("is zero and future on the day itself", () => {
    const facts = deriveHolidayFacts(
      makeGroup({ dates: ["2026-06-10"], primaryDate: "2026-06-10" }),
      new Date("2026-06-10T23:00:00Z")
    );
    expect(facts.daysUntil).toBe(0);
    expect(facts.isFuture).toBe(true);
  });
});

describe("deriveHolidayFacts — scope and types", () => {
  it("national when global", () => {
    const f = deriveHolidayFacts(makeGroup({ global: true }), new Date());
    expect(f.scope).toBe("national");
    expect(f.regionCount).toBe(0);
  });

  it("regional when counties present and not global", () => {
    const f = deriveHolidayFacts(
      makeGroup({ global: false, counties: ["US-TX", "US-CA"] }),
      new Date()
    );
    expect(f.scope).toBe("regional");
    expect(f.regionCount).toBe(2);
  });

  it("unknown when not global and counties null", () => {
    const f = deriveHolidayFacts(
      makeGroup({ global: false, counties: null }),
      new Date()
    );
    expect(f.scope).toBe("unknown");
  });

  it("splits public from other types and flags multi-date", () => {
    const f = deriveHolidayFacts(
      makeGroup({
        types: ["Public", "Optional"],
        dates: ["2026-06-10", "2026-06-11"],
      }),
      new Date()
    );
    expect(f.isPublic).toBe(true);
    expect(f.otherTypes).toEqual(["Optional"]);
    expect(f.multiDate).toBe(true);
  });
});
