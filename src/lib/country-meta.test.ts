import { describe, it, expect } from "vitest";
import { COUNTRIES } from "./countries";
import {
  timeZoneForCountry,
  currencyForCountry,
  isoWeek,
  dayOfYear,
} from "./country-meta";

describe("isoWeek — ISO 8601 week numbers (UTC-safe)", () => {
  it("2026-01-01 is week 1 (Thursday, first Thursday of the year)", () => {
    expect(isoWeek("2026-01-01")).toBe(1);
  });

  it("2026-08-09 is week 32", () => {
    expect(isoWeek("2026-08-09")).toBe(32);
  });

  it("2025-12-29 (Monday) rolls into week 1 of ISO 2026", () => {
    expect(isoWeek("2025-12-29")).toBe(1);
  });

  it("2024-12-31 rolls into week 1 of ISO 2025", () => {
    expect(isoWeek("2024-12-31")).toBe(1);
  });

  it("2026-12-31 is week 53 (2026 has 53 ISO weeks)", () => {
    expect(isoWeek("2026-12-31")).toBe(53);
  });

  it("2025-01-06 is week 2", () => {
    expect(isoWeek("2025-01-06")).toBe(2);
  });

  it("invalid input returns NaN instead of throwing", () => {
    expect(Number.isNaN(isoWeek("not-a-date"))).toBe(true);
  });
});

describe("dayOfYear — ordinal day within the year (UTC-safe)", () => {
  it("2026-01-01 is day 1", () => {
    expect(dayOfYear("2026-01-01")).toBe(1);
  });

  it("2026-08-09 is day 221 (non-leap year)", () => {
    expect(dayOfYear("2026-08-09")).toBe(221);
  });

  it("2025-12-29 is day 363 (non-leap year)", () => {
    expect(dayOfYear("2025-12-29")).toBe(363);
  });

  it("2024-12-31 is day 366 (leap year)", () => {
    expect(dayOfYear("2024-12-31")).toBe(366);
  });

  it("2026-12-31 is day 365 (non-leap year)", () => {
    expect(dayOfYear("2026-12-31")).toBe(365);
  });

  it("invalid input returns NaN instead of throwing", () => {
    expect(Number.isNaN(dayOfYear("bad"))).toBe(true);
  });
});

describe("timeZoneForCountry — capital / main-city IANA zones", () => {
  it("maps popular markets to their capital zones", () => {
    expect(timeZoneForCountry("US")).toBe("America/New_York");
    expect(timeZoneForCountry("JP")).toBe("Asia/Tokyo");
    expect(timeZoneForCountry("GB")).toBe("Europe/London");
    expect(timeZoneForCountry("AU")).toBe("Australia/Sydney");
    expect(timeZoneForCountry("CA")).toBe("America/Toronto");
    expect(timeZoneForCountry("DE")).toBe("Europe/Berlin");
  });

  it("handles multi-timezone countries with the capital zone", () => {
    expect(timeZoneForCountry("BR")).toBe("America/Sao_Paulo");
    expect(timeZoneForCountry("RU")).toBe("Europe/Moscow");
    expect(timeZoneForCountry("KZ")).toBe("Asia/Almaty");
  });

  it("is case-insensitive like getCountry", () => {
    expect(timeZoneForCountry("us")).toBe("America/New_York");
  });

  it("returns null for unknown country codes (callers omit the row)", () => {
    expect(timeZoneForCountry("XX")).toBeNull();
    expect(timeZoneForCountry("")).toBeNull();
  });
});

describe("currencyForCountry — ISO 4217", () => {
  it("maps popular markets to their legal tender", () => {
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("JP")).toBe("JPY");
    expect(currencyForCountry("GB")).toBe("GBP");
    expect(currencyForCountry("DE")).toBe("EUR");
    expect(currencyForCountry("CN")).toBe("CNY");
    expect(currencyForCountry("BR")).toBe("BRL");
  });

  it("maps dollarized economies to USD", () => {
    expect(currencyForCountry("EC")).toBe("USD");
    expect(currencyForCountry("SV")).toBe("USD");
  });

  it("returns null for unknown country codes (callers omit the row)", () => {
    expect(currencyForCountry("XX")).toBeNull();
    expect(currencyForCountry("")).toBeNull();
  });
});

describe("catalogue coverage — every COUNTRIES code resolves", () => {
  it("every code in COUNTRIES has a time zone", () => {
    const missing = COUNTRIES.filter((c) => timeZoneForCountry(c.code) === null).map(
      (c) => c.code
    );
    expect(missing).toEqual([]);
  });

  it("every code in COUNTRIES has a currency", () => {
    const missing = COUNTRIES.filter((c) => currencyForCountry(c.code) === null).map(
      (c) => c.code
    );
    expect(missing).toEqual([]);
  });
});
