import type { Country } from "./types";

// Curated list for the selector. Nager.Date supports 120+ countries; this covers
// the most common markets for an overseas audience. Extend as needed.
export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", popular: true },
  { code: "GB", name: "United Kingdom", popular: true },
  { code: "CA", name: "Canada", popular: true },
  { code: "AU", name: "Australia", popular: true },
  { code: "DE", name: "Germany", popular: true },
  { code: "FR", name: "France", popular: true },
  { code: "ES", name: "Spain", popular: true },
  { code: "IT", name: "Italy", popular: true },
  { code: "NL", name: "Netherlands", popular: true },
  { code: "IE", name: "Ireland", popular: true },
  { code: "SE", name: "Sweden", popular: true },
  { code: "CH", name: "Switzerland", popular: true },
  { code: "AT", name: "Austria", popular: true },
  { code: "BE", name: "Belgium", popular: true },
  { code: "PT", name: "Portugal", popular: true },
  { code: "PL", name: "Poland", popular: true },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India", popular: true },
  { code: "BR", name: "Brazil", popular: true },
  { code: "MX", name: "Mexico", popular: true },
  { code: "AR", name: "Argentina" },
  { code: "ZA", name: "South Africa" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "NZ", name: "New Zealand" },
  { code: "DK", name: "Denmark" },
  { code: "NO", name: "Norway" },
  { code: "FI", name: "Finland" },
  { code: "CZ", name: "Czechia" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "TH", name: "Thailand" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "NG", name: "Nigeria" },
  { code: "EG", name: "Egypt" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
];

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
}

export const POPULAR_COUNTRIES = COUNTRIES.filter((c) => c.popular);
