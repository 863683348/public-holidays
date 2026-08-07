import { describe, it, expect } from "vitest";
import { slugifyHoliday, groupHolidays, findHolidayGroup } from "./slug";
import type { Holiday } from "./types";
import US2026 from "./__fixtures__/holidays-US-2026.json";
import AU2026 from "./__fixtures__/holidays-AU-2026.json";
import KR2026 from "./__fixtures__/holidays-KR-2026.json";
import RU2026 from "./__fixtures__/holidays-RU-2026.json";

const us = US2026 as Holiday[];
const au = AU2026 as Holiday[];
const kr = KR2026 as Holiday[];
const ru = RU2026 as Holiday[];

describe("slugifyHoliday", () => {
  it.each([
    ["New Year's Day", "new-years-day"],
    ["Święto Konstytucji 3 Maja", "swieto-konstytucji-3-maja"],
    ["Día de la Hispanidad", "dia-de-la-hispanidad"],
    ["Christmas & Boxing Day", "christmas-and-boxing-day"],
    ["  --Foo--  ", "foo"],
    ["", "holiday"],
  ])("slugifies %j -> %j", (input, expected) => {
    expect(slugifyHoliday(input)).toBe(expected);
  });

  it("returns 'holiday' for null/undefined", () => {
    // @ts-expect-error — exercising the runtime guard for bad upstream data
    expect(slugifyHoliday(null)).toBe("holiday");
    // @ts-expect-error — exercising the runtime guard for bad upstream data
    expect(slugifyHoliday(undefined)).toBe("holiday");
  });

  it("truncates to 80 chars at a hyphen boundary", () => {
    const long = "a".repeat(60) + " " + "b".repeat(60);
    const slug = slugifyHoliday(long);
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
    expect(slug).toBe("a".repeat(60)); // second word dropped at the boundary
  });
});

describe("groupHolidays — live 2026 fixtures", () => {
  it("US 2026: 17 records -> 15 groups", () => {
    expect(us.length).toBe(17);
    expect(groupHolidays(us).length).toBe(15);
  });

  it("RU 2026: 13 records -> 9 groups", () => {
    expect(ru.length).toBe(13);
    expect(groupHolidays(ru).length).toBe(9);
  });

  it("US good-friday: 1 date, types [Public, Optional], 11 counties, global false", () => {
    const g = findHolidayGroup(us, "good-friday");
    expect(g).not.toBeNull();
    expect(g!.dates.length).toBe(1);
    expect(g!.types).toEqual(["Public", "Optional"]);
    expect(g!.counties).not.toBeNull();
    expect(g!.counties!.length).toBe(11);
    expect(g!.global).toBe(false);
  });

  it("US columbus-day: one global record -> counties null", () => {
    const g = findHolidayGroup(us, "columbus-day");
    expect(g).not.toBeNull();
    expect(g!.global).toBe(true);
    expect(g!.counties).toBeNull();
  });

  it("AU labour-day: one group with 4 distinct dates", () => {
    const g = findHolidayGroup(au, "labour-day");
    expect(g).not.toBeNull();
    expect(g!.dates).toEqual([
      "2026-03-02",
      "2026-03-09",
      "2026-05-04",
      "2026-10-05",
    ]);
  });

  it("KR lunar-new-year: 3 consecutive dates, global true", () => {
    const g = findHolidayGroup(kr, "lunar-new-year");
    expect(g).not.toBeNull();
    expect(g!.dates).toEqual(["2026-02-16", "2026-02-17", "2026-02-18"]);
    expect(g!.global).toBe(true);
  });

  it("groups are sorted ascending by primaryDate", () => {
    const groups = groupHolidays(us);
    for (let i = 1; i < groups.length; i++) {
      expect(
        groups[i - 1].primaryDate.localeCompare(groups[i].primaryDate)
      ).toBeLessThanOrEqual(0);
    }
  });
});

describe("findHolidayGroup", () => {
  it("is case- and diacritic-insensitive on the input", () => {
    expect(findHolidayGroup(us, "GOOD-FRIDAY")?.slug).toBe("good-friday");
  });

  it("returns null for an unknown slug", () => {
    expect(findHolidayGroup(us, "not-a-real-holiday")).toBeNull();
  });
});
