import { describe, it, expect } from "vitest";
import { regionName } from "./region-names";

// SPEC-002 §3c — ISO-3166-2 subdivision codes → English region names.
// English-only by design; unknown codes fall back to the raw input. Pure
// function, no network, no I/O — runs in any Node environment.

describe("regionName (SPEC-002 §3c)", () => {
  it("resolves known ISO-3166-2 subdivision codes to English names", () => {
    expect(regionName("AU-WA")).toBe("Western Australia");
    expect(regionName("US-CA")).toBe("California");
    expect(regionName("GB-ENG")).toBe("England");
  });

  it("is case-insensitive for known codes", () => {
    expect(regionName("au-wa")).toBe("Western Australia");
    expect(regionName("Us-ca")).toBe("California");
  });

  it("falls back to the raw code for unknown subdivisions", () => {
    expect(regionName("XX-YY")).toBe("XX-YY");
    expect(regionName("AU-ZZ")).toBe("AU-ZZ");
  });

  it("falls back to the raw input for empty or whitespace-only codes", () => {
    expect(regionName("")).toBe("");
    expect(regionName("  ")).toBe("  ");
  });

  it("never throws for arbitrary input", () => {
    expect(() => regionName("not-a-code")).not.toThrow();
    expect(regionName("not-a-code")).toBe("not-a-code");
  });
});
