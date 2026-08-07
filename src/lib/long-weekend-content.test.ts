import { describe, it, expect } from "vitest";
import { buildLongWeekendGuide } from "./long-weekend-content";
import type { Holiday } from "./types";
import US2026 from "./__fixtures__/holidays-US-2026.json";
import AU2026 from "./__fixtures__/holidays-AU-2026.json";
import KR2026 from "./__fixtures__/holidays-KR-2026.json";
import RU2026 from "./__fixtures__/holidays-RU-2026.json";

const us = US2026 as Holiday[];
const au = AU2026 as Holiday[];
const kr = KR2026 as Holiday[];
const ru = RU2026 as Holiday[];

// Minimal Holiday factory for synthetic scenarios.
function h(date: string, name = date, global = true): Holiday {
  return {
    date,
    localName: name,
    name,
    countryCode: "US",
    fixed: true,
    global,
    counties: null,
    types: ["Public"],
  };
}

describe("buildLongWeekendGuide — fixtures (no network)", () => {
  it("US 2026: 13 long weekends, 10 natural + 3 bridge, 42 total days", () => {
    const g = buildLongWeekendGuide(us, "US", 2026);
    expect(g.countryCode).toBe("US");
    expect(g.year).toBe(2026);
    expect(g.totalCount).toBe(13);
    expect(g.naturalCount).toBe(10);
    expect(g.bridgeCount).toBe(3);
    expect(g.totalDays).toBe(42);
  });

  it("US 2026: first entry is New Year's with a Jan 2 bridge day", () => {
    const g = buildLongWeekendGuide(us, "US", 2026);
    const first = g.longWeekends[0];
    expect(first.start).toBe("2026-01-01");
    expect(first.end).toBe("2026-01-04");
    expect(first.days).toBe(4);
    expect(first.needBridge).toBe(true);
    expect(first.bridgeDay).toBe("2026-01-02");
    expect(first.dates).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
      "2026-01-04",
    ]);
    // Anchor holiday: New Year's Day (2026-01-01).
    expect(first.holidays.some((x) => x.date === "2026-01-01")).toBe(true);
  });

  it("US 2026: Thanksgiving long weekend requires Nov 27 bridge", () => {
    const g = buildLongWeekendGuide(us, "US", 2026);
    const tg = g.longWeekends.find((l) => l.start === "2026-11-26");
    expect(tg).toBeDefined();
    expect(tg!.end).toBe("2026-11-29");
    expect(tg!.needBridge).toBe(true);
    expect(tg!.bridgeDay).toBe("2026-11-27");
    expect(tg!.holidays.map((x) => x.name)).toContain("Thanksgiving Day");
  });

  it("US 2026: Memorial Day weekend is natural (no bridge)", () => {
    const g = buildLongWeekendGuide(us, "US", 2026);
    const mem = g.longWeekends.find((l) => l.start === "2026-05-23");
    expect(mem).toBeDefined();
    expect(mem!.needBridge).toBe(false);
    expect(mem!.holidays.map((x) => x.name)).toContain("Memorial Day");
  });

  it("AU 2026: Easter long weekend is a natural 4-day run", () => {
    const g = buildLongWeekendGuide(au, "AU", 2026);
    const easter = g.longWeekends.find((l) => l.start === "2026-04-03");
    expect(easter).toBeDefined();
    expect(easter!.end).toBe("2026-04-06");
    expect(easter!.days).toBe(4);
    expect(easter!.needBridge).toBe(false);
    const names = easter!.holidays.map((x) => x.name);
    expect(names).toContain("Good Friday");
    expect(names).toContain("Easter Monday");
  });

  it("KR 2026: Lunar New Year cluster is a natural 5-day run", () => {
    const g = buildLongWeekendGuide(kr, "KR", 2026);
    const seollal = g.longWeekends.find((l) => l.start === "2026-02-14");
    expect(seollal).toBeDefined();
    expect(seollal!.end).toBe("2026-02-18");
    expect(seollal!.days).toBe(5);
    expect(seollal!.needBridge).toBe(false);
  });

  it("RU 2026: New Year break is a natural 7-day run", () => {
    const g = buildLongWeekendGuide(ru, "RU", 2026);
    const ny = g.longWeekends.find((l) => l.start === "2026-01-01");
    expect(ny).toBeDefined();
    expect(ny!.end).toBe("2026-01-07");
    expect(ny!.days).toBe(7);
    expect(ny!.needBridge).toBe(false);
  });
});

describe("buildLongWeekendGuide — synthetic edge cases", () => {
  it("returns an empty guide when no holidays and no natural runs", () => {
    const g = buildLongWeekendGuide([], "US", 2026);
    expect(g.totalCount).toBe(0);
    expect(g.naturalCount).toBe(0);
    expect(g.bridgeCount).toBe(0);
    expect(g.totalDays).toBe(0);
    expect(g.longWeekends).toEqual([]);
  });

  it("sorts entries ascending by start date", () => {
    const holidays = [
      h("2026-12-25", "Christmas Day"),
      h("2026-01-01", "New Year's Day"),
    ];
    const g = buildLongWeekendGuide(holidays, "US", 2026);
    expect(g.totalCount).toBeGreaterThanOrEqual(2);
    const starts = g.longWeekends.map((l) => l.start);
    expect([...starts].sort()).toEqual(starts);
  });

  it("attaches only holidays that fall inside the span", () => {
    // Jan 2 (Fri) holiday => natural Fri-Sun run Jan 2-4. A separate midweek
    // holiday (Jun 10, Wed) forms no long weekend and must not leak in.
    const holidays = [
      h("2026-01-02", "Extra Holiday"),
      h("2026-06-10", "Midweek Holiday"),
    ];
    const g = buildLongWeekendGuide(holidays, "US", 2026);
    const jan2 = g.longWeekends.find((l) => l.start === "2026-01-02");
    expect(jan2).toBeDefined();
    expect(jan2!.end).toBe("2026-01-04");
    expect(jan2!.holidays.map((x) => x.name)).toContain("Extra Holiday");
    expect(jan2!.holidays.map((x) => x.name)).not.toContain("Midweek Holiday");
    // Midweek holiday is simply not part of any long weekend.
    const all = g.longWeekends.flatMap((l) => l.holidays.map((x) => x.name));
    expect(all).not.toContain("Midweek Holiday");
  });
});
