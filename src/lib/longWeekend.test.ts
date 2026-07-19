import { describe, it, expect } from "vitest";
import { findLongWeekends } from "./longWeekend";
import type { Holiday } from "./types";

// Synthetic US-like holidays for 2025 (Jan 1 is Wed; we omit it for determinism).
const holidays: Holiday[] = [
  {
    date: "2025-01-03",
    localName: "Fri",
    name: "Friday Holiday",
    countryCode: "US",
    fixed: false,
    global: true,
    counties: null,
    types: ["Public"],
  },
  {
    date: "2025-01-07",
    localName: "Tue",
    name: "Tuesday Holiday",
    countryCode: "US",
    fixed: false,
    global: true,
    counties: null,
    types: ["Public"],
  },
  {
    date: "2025-01-09",
    localName: "Thu",
    name: "Thursday Holiday",
    countryCode: "US",
    fixed: false,
    global: true,
    counties: null,
    types: ["Public"],
  },
];

describe("findLongWeekends", () => {
  const result = findLongWeekends(holidays, 2025);

  it("detects a natural Fri-Sun long weekend", () => {
    const nat = result.find((r) => !r.needBridge && r.start === "2025-01-03");
    expect(nat).toBeDefined();
    expect(nat!.end).toBe("2025-01-05");
    expect(nat!.days).toBe(3);
  });

  it("detects a Tuesday bridge (take Monday off -> 4 days)", () => {
    const bridge = result.find((r) => r.bridgeDay === "2025-01-06");
    expect(bridge).toBeDefined();
    expect(bridge!.start).toBe("2025-01-04");
    expect(bridge!.end).toBe("2025-01-07");
    expect(bridge!.days).toBe(4);
  });

  it("detects a Thursday bridge (take Friday off -> 4 days)", () => {
    const bridge = result.find((r) => r.bridgeDay === "2025-01-10");
    expect(bridge).toBeDefined();
    expect(bridge!.start).toBe("2025-01-09");
    expect(bridge!.end).toBe("2025-01-12");
    expect(bridge!.days).toBe(4);
  });
});
