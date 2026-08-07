import { describe, it, expect } from "vitest";
import {
  parseCompareParams,
  resolveCompareSelection,
  monthLength,
  computeCompareMatrix,
  encodeShareUrl,
  DEFAULT_SELECTION,
  DEFAULT_YEAR,
} from "./compare";
import { findLongWeekends } from "./longWeekend";
import type { Holiday } from "./types";
import US2026 from "./__fixtures__/holidays-US-2026.json";
import AU2026 from "./__fixtures__/holidays-AU-2026.json";
import KR2026 from "./__fixtures__/holidays-KR-2026.json";
import RU2026 from "./__fixtures__/holidays-RU-2026.json";

const us = US2026 as Holiday[];
const au = AU2026 as Holiday[];
const kr = KR2026 as Holiday[];
const ru = RU2026 as Holiday[];

// Minimal Holiday record factory for synthetic scenarios (no JP/DE fixtures).
function h(date: string): Holiday {
  return {
    date,
    localName: date,
    name: date,
    countryCode: "US",
    fixed: true,
    global: true,
    counties: null,
    types: ["Public"],
  };
}

describe("parseCompareParams (SPEC-002 §1 vectors 1-3)", () => {
  it("dedupes + uppercases codes and parses the year", () => {
    expect(parseCompareParams("us,GB,us", "2026")).toEqual({
      codes: ["US", "GB"],
      year: 2026,
    });
  });

  it("returns null when either param is missing", () => {
    expect(parseCompareParams(null, null)).toBeNull();
    expect(parseCompareParams("US", null)).toBeNull();
    expect(parseCompareParams(null, "2026")).toBeNull();
  });

  it("returns null for a year outside the window", () => {
    expect(parseCompareParams("US", "1999")).toBeNull();
    expect(parseCompareParams("US", "2036")).toBeNull();
  });

  it("splits on + and whitespace too, and rejects empty code lists", () => {
    expect(parseCompareParams("US+GB+DE", "2026")).toEqual({
      codes: ["US", "GB", "DE"],
      year: 2026,
    });
    expect(parseCompareParams("US, GB", "2026")).toEqual({
      codes: ["US", "GB"],
      year: 2026,
    });
    expect(parseCompareParams("  ,  ", "2026")).toBeNull();
  });
});

describe("resolveCompareSelection (SPEC-002 §1 vectors 4-6)", () => {
  it("drops unknown codes", () => {
    expect(resolveCompareSelection(["US", "GB", "XX"], 2026)).toEqual({
      codes: ["US", "GB"],
      year: 2026,
    });
  });

  it("falls back to defaults when too few codes", () => {
    expect(resolveCompareSelection(["US"], 2026)).toEqual({
      codes: DEFAULT_SELECTION,
      year: DEFAULT_YEAR,
    });
  });

  it("falls back to defaults when too many codes", () => {
    expect(
      resolveCompareSelection(["US", "GB", "DE", "FR", "IT", "ES", "JP"], 2026)
    ).toEqual({ codes: DEFAULT_SELECTION, year: DEFAULT_YEAR });
  });

  it("dedupes and normalises case, and clamps an invalid year", () => {
    expect(resolveCompareSelection(["us", "GB", "us"], 2026)).toEqual({
      codes: ["US", "GB"],
      year: 2026,
    });
    expect(resolveCompareSelection(["US", "GB"], null)).toEqual({
      codes: ["US", "GB"],
      year: DEFAULT_YEAR,
    });
    expect(resolveCompareSelection(["US", "GB"], 1999)).toEqual({
      codes: ["US", "GB"],
      year: DEFAULT_YEAR,
    });
  });
});

describe("monthLength (UTC-exact)", () => {
  it("handles Feb leap and non-leap years", () => {
    expect(monthLength(2026, 1)).toBe(28);
    expect(monthLength(2024, 1)).toBe(29);
  });

  it("returns the right lengths for 30/31-day months", () => {
    expect(monthLength(2026, 3)).toBe(30); // April
    expect(monthLength(2026, 0)).toBe(31); // January
    expect(monthLength(2026, 11)).toBe(31); // December
  });
});

describe("computeCompareMatrix", () => {
  it("US+AU 2026: allOff is exactly the real shared dates (vector 7)", () => {
    const matrix = computeCompareMatrix(
      [
        { code: "US", name: "United States", holidays: us },
        { code: "AU", name: "Australia", holidays: au },
      ],
      2026
    );
    // Intersection of the two fixture date sets: New Year's Day, Good Friday,
    // Christmas Day. No other date appears in both.
    expect(matrix.allOff).toEqual(["2026-01-01", "2026-04-03", "2026-12-25"]);
    expect(matrix.countries.map((c) => c.code)).toEqual(["US", "AU"]);
    expect(matrix.year).toBe(2026);
  });

  it("longWeekendCounts matches findLongWeekends for each country", () => {
    const matrix = computeCompareMatrix(
      [
        { code: "US", name: "United States", holidays: us },
        { code: "AU", name: "Australia", holidays: au },
      ],
      2026
    );
    expect(matrix.longWeekendCounts["US"]).toBe(findLongWeekends(us, 2026).length);
    expect(matrix.longWeekendCounts["AU"]).toBe(findLongWeekends(au, 2026).length);
  });

  it("disjoint holiday sets produce an empty allOff without throwing (vector 8)", () => {
    // Midweek (Wed) singles — no weekend adjacency, so no long weekends.
    const matrix = computeCompareMatrix(
      [
        { code: "US", name: "United States", holidays: [h("2026-06-10")] },
        { code: "JP", name: "Japan", holidays: [h("2026-06-17")] },
        { code: "DE", name: "Germany", holidays: [h("2026-06-24")] },
      ],
      2026
    );
    expect(matrix.allOff).toEqual([]);
    expect(matrix.longWeekendCounts["US"]).toBe(0);
    expect(matrix.longWeekendCounts["JP"]).toBe(0);
    expect(matrix.longWeekendCounts["DE"]).toBe(0);
  });

  it("US+KR+RU real fixtures: only New Year's Day is common to all three", () => {
    const matrix = computeCompareMatrix(
      [
        { code: "US", name: "United States", holidays: us },
        { code: "KR", name: "South Korea", holidays: kr },
        { code: "RU", name: "Russia", holidays: ru },
      ],
      2026
    );
    expect(matrix.allOff).toEqual(["2026-01-01"]);
  });

  it("handles empty input without crashing", () => {
    const matrix = computeCompareMatrix([], 2026);
    expect(matrix.allOff).toEqual([]);
    expect(matrix.longWeekendCounts).toEqual({});
  });
});

describe("encodeShareUrl", () => {
  it("builds the documented share URL shape", () => {
    const url = encodeShareUrl("https://public-holidays.shop", "en", ["US", "GB", "DE"], 2026);
    expect(url).toBe("https://public-holidays.shop/en/compare?c=US,GB,DE&y=2026");
  });

  it("round-trips through parseCompareParams (vector 9)", () => {
    const url = encodeShareUrl("https://public-holidays.shop", "en", ["US", "GB", "DE"], 2026);
    const qs = new URL(url);
    expect(
      parseCompareParams(qs.searchParams.get("c"), qs.searchParams.get("y"))
    ).toEqual({ codes: ["US", "GB", "DE"], year: 2026 });
  });

  it("normalises slashes and dedupes codes", () => {
    expect(encodeShareUrl("https://site/", "/en/", ["US", "US", "GB"], 2026)).toBe(
      "https://site/en/compare?c=US,GB&y=2026"
    );
  });
});
