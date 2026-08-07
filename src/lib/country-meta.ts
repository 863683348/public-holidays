/**
 * Country meta-data helpers for the holiday detail page (P1-②).
 *
 * Adds the "micro data" rows competitors surface on their detail pages:
 *   - local time zone (IANA, capital / main city)
 *   - local currency (ISO 4217)
 *   - ISO 8601 week number of the primary date
 *   - day-of-year (1-366) of the primary date
 *
 * Coverage policy: every code in `COUNTRIES` (src/lib/countries.ts) is mapped.
 * A country we cannot map honestly returns `null` — callers omit that row
 * rather than showing a placeholder. Date math is UTC-safe: inputs are parsed
 * as `YYYY-MM-DDT00:00:00Z` so results never depend on the server time zone.
 *
 * Multi-timezone countries use the capital / main-city zone (e.g. US →
 * America/New_York for Washington DC, not the country's full zone list).
 */
import { getCountry } from "./countries";

/** IANA time zone for the country's capital / main city. */
const TIME_ZONES: Record<string, string> = {
  // North America / Oceania popular markets
  US: "America/New_York", // Washington DC
  CA: "America/Toronto", // Ottawa
  MX: "America/Mexico_City",
  AU: "Australia/Sydney", // Canberra
  NZ: "Pacific/Auckland",
  // Europe
  GB: "Europe/London",
  IE: "Europe/Dublin",
  DE: "Europe/Berlin",
  FR: "Europe/Paris",
  ES: "Europe/Madrid",
  IT: "Europe/Rome",
  NL: "Europe/Amsterdam",
  BE: "Europe/Brussels",
  CH: "Europe/Zurich", // Bern
  AT: "Europe/Vienna",
  PT: "Europe/Lisbon",
  SE: "Europe/Stockholm",
  DK: "Europe/Copenhagen",
  NO: "Europe/Oslo",
  FI: "Europe/Helsinki",
  PL: "Europe/Warsaw",
  CZ: "Europe/Prague",
  SK: "Europe/Bratislava",
  HU: "Europe/Budapest",
  RO: "Europe/Bucharest",
  BG: "Europe/Sofia",
  GR: "Europe/Athens",
  HR: "Europe/Zagreb",
  SI: "Europe/Ljubljana",
  RS: "Europe/Belgrade",
  BA: "Europe/Sarajevo",
  MK: "Europe/Skopje",
  AL: "Europe/Tirane",
  ME: "Europe/Podgorica",
  IS: "Atlantic/Reykjavik",
  LU: "Europe/Luxembourg",
  MT: "Europe/Malta",
  CY: "Asia/Nicosia",
  EE: "Europe/Tallinn",
  LV: "Europe/Riga",
  LT: "Europe/Vilnius",
  UA: "Europe/Kyiv",
  BY: "Europe/Minsk",
  MD: "Europe/Chisinau",
  // Asia / MENA
  JP: "Asia/Tokyo",
  KR: "Asia/Seoul",
  CN: "Asia/Shanghai", // Beijing
  HK: "Asia/Hong_Kong",
  TW: "Asia/Taipei",
  SG: "Asia/Singapore",
  IN: "Asia/Kolkata",
  TH: "Asia/Bangkok",
  MY: "Asia/Kuala_Lumpur",
  ID: "Asia/Jakarta",
  PH: "Asia/Manila",
  VN: "Asia/Ho_Chi_Minh", // Hanoi
  KH: "Asia/Phnom_Penh",
  BD: "Asia/Dhaka",
  MN: "Asia/Ulaanbaatar",
  KZ: "Asia/Almaty", // Astana
  PG: "Pacific/Port_Moresby",
  TR: "Europe/Istanbul",
  RU: "Europe/Moscow",
  GE: "Asia/Tbilisi",
  AM: "Asia/Yerevan",
  AE: "Asia/Dubai",
  SA: "Asia/Riyadh",
  IL: "Asia/Jerusalem",
  IQ: "Asia/Baghdad",
  BH: "Asia/Bahrain",
  // Africa
  EG: "Africa/Cairo",
  MA: "Africa/Casablanca",
  DZ: "Africa/Algiers",
  TN: "Africa/Tunis",
  NG: "Africa/Lagos",
  GH: "Africa/Accra",
  KE: "Africa/Nairobi",
  TZ: "Africa/Dar_es_Salaam",
  UG: "Africa/Kampala",
  ET: "Africa/Addis_Ababa",
  ZA: "Africa/Johannesburg", // Pretoria
  ZW: "Africa/Harare",
  ZM: "Africa/Lusaka",
  MZ: "Africa/Maputo",
  AO: "Africa/Luanda",
  CM: "Africa/Douala", // Yaoundé
  CI: "Africa/Abidjan",
  SN: "Africa/Dakar",
  // Latin America / Caribbean
  BR: "America/Sao_Paulo", // Brasília
  AR: "America/Argentina/Buenos_Aires",
  CL: "America/Santiago",
  CO: "America/Bogota",
  PE: "America/Lima",
  VE: "America/Caracas",
  EC: "America/Guayaquil", // Quito
  BO: "America/La_Paz",
  PY: "America/Asuncion",
  UY: "America/Montevideo",
  CR: "America/Costa_Rica",
  PA: "America/Panama",
  GT: "America/Guatemala",
  HN: "America/Tegucigalpa",
  SV: "America/El_Salvador",
  NI: "America/Managua",
  DO: "America/Santo_Domingo",
  CU: "America/Havana",
  JM: "America/Jamaica",
  TT: "America/Port_of_Spain",
  PR: "America/Puerto_Rico",
  BS: "America/Nassau",
  // ---- Tier-B expansion (+41) ----
  CD: "Africa/Kinshasa",
  SD: "Africa/Khartoum",
  MG: "Indian/Antananarivo",
  ML: "Africa/Bamako",
  BF: "Africa/Ouagadougou",
  NE: "Africa/Niamey",
  MW: "Africa/Blantyre",
  TD: "Africa/Ndjamena",
  GN: "Africa/Conakry",
  BI: "Africa/Bujumbura",
  RW: "Africa/Kigali",
  BJ: "Africa/Porto-Novo",
  TG: "Africa/Lome",
  SL: "Africa/Freetown",
  LR: "Africa/Monrovia",
  SO: "Africa/Mogadishu",
  SS: "Africa/Juba",
  MR: "Africa/Nouakchott",
  ER: "Africa/Asmara",
  LY: "Africa/Tripoli",
  BW: "Africa/Gaborone",
  NA: "Africa/Windhoek",
  LS: "Africa/Maseru",
  GA: "Africa/Libreville",
  SZ: "Africa/Mbabane",
  GM: "Africa/Banjul",
  CF: "Africa/Bangui",
  CG: "Africa/Brazzaville",
  YE: "Asia/Aden",
  SY: "Asia/Damascus",
  DJ: "Africa/Djibouti",
  HT: "America/Port-au-Prince",
  BB: "America/Barbados",
  LC: "America/St_Lucia",
  GD: "America/Grenada",
  GY: "America/Guyana",
  SR: "America/Paramaribo",
  LI: "Europe/Vaduz",
  MC: "Europe/Monaco",
  SM: "Europe/San_Marino",
  AD: "Europe/Andorra",
};

/** ISO 4217 currency code for the country's legal tender. */
const CURRENCIES: Record<string, string> = {
  // North America / Oceania popular markets
  US: "USD",
  CA: "CAD",
  MX: "MXN",
  AU: "AUD",
  NZ: "NZD",
  // Europe
  GB: "GBP",
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  CH: "CHF",
  AT: "EUR",
  PT: "EUR",
  SE: "SEK",
  DK: "DKK",
  NO: "NOK",
  FI: "EUR",
  PL: "PLN",
  CZ: "CZK",
  SK: "EUR",
  HU: "HUF",
  RO: "RON",
  BG: "BGN",
  GR: "EUR",
  HR: "EUR",
  SI: "EUR",
  RS: "RSD",
  BA: "BAM",
  MK: "MKD",
  AL: "ALL",
  ME: "EUR",
  IS: "ISK",
  LU: "EUR",
  MT: "EUR",
  CY: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  UA: "UAH",
  BY: "BYN",
  MD: "MDL",
  // Asia / MENA
  JP: "JPY",
  KR: "KRW",
  CN: "CNY",
  HK: "HKD",
  TW: "TWD",
  SG: "SGD",
  IN: "INR",
  TH: "THB",
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
  KH: "KHR",
  BD: "BDT",
  MN: "MNT",
  KZ: "KZT",
  PG: "PGK",
  TR: "TRY",
  RU: "RUB",
  GE: "GEL",
  AM: "AMD",
  AE: "AED",
  SA: "SAR",
  IL: "ILS",
  IQ: "IQD",
  BH: "BHD",
  // Africa
  EG: "EGP",
  MA: "MAD",
  DZ: "DZD",
  TN: "TND",
  NG: "NGN",
  GH: "GHS",
  KE: "KES",
  TZ: "TZS",
  UG: "UGX",
  ET: "ETB",
  ZA: "ZAR",
  ZW: "ZWL",
  ZM: "ZMW",
  MZ: "MZN",
  AO: "AOA",
  CM: "XAF",
  CI: "XOF",
  SN: "XOF",
  // Latin America / Caribbean
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  PE: "PEN",
  VE: "VES",
  EC: "USD", // Ecuador uses the US dollar
  BO: "BOB",
  PY: "PYG",
  UY: "UYU",
  CR: "CRC",
  PA: "PAB",
  GT: "GTQ",
  HN: "HNL",
  SV: "USD", // El Salvador uses the US dollar
  NI: "NIO",
  DO: "DOP",
  CU: "CUP",
  JM: "JMD",
  TT: "TTD",
  PR: "USD",
  BS: "BSD",
  // ---- Tier-B expansion (+41) ----
  CD: "CDF",
  SD: "SDG",
  MG: "MGA",
  ML: "XOF",
  BF: "XOF",
  NE: "XOF",
  MW: "MWK",
  TD: "XAF",
  GN: "GNF",
  BI: "BIF",
  RW: "RWF",
  BJ: "XOF",
  TG: "XOF",
  SL: "SLL",
  LR: "LRD",
  SO: "SOS",
  SS: "SSP",
  MR: "MRU",
  ER: "ERN",
  LY: "LYD",
  BW: "BWP",
  NA: "NAD",
  LS: "LSL",
  GA: "XAF",
  SZ: "SZL",
  GM: "GMD",
  CF: "XAF",
  CG: "XAF",
  YE: "YER",
  SY: "SYP",
  DJ: "DJF",
  HT: "HTG",
  BB: "BBD",
  LC: "XCD",
  GD: "XCD",
  GY: "GYD",
  SR: "SRD",
  LI: "CHF",
  MC: "EUR",
  SM: "EUR",
  AD: "EUR",
};

/**
 * IANA time zone for a country's capital / main city, or `null` when unknown.
 * Only codes present in the country catalogue are resolved.
 */
export function timeZoneForCountry(code: string): string | null {
  const c = getCountry(code);
  if (!c) return null;
  return TIME_ZONES[c.code.toUpperCase()] ?? null;
}

/**
 * ISO 4217 currency code for a country, or `null` when unknown.
 * Only codes present in the country catalogue are resolved.
 */
export function currencyForCountry(code: string): string | null {
  const c = getCountry(code);
  if (!c) return null;
  return CURRENCIES[c.code.toUpperCase()] ?? null;
}

/**
 * ISO 8601 week number (1-53) for a `YYYY-MM-DD` date, computed in UTC so the
 * result never depends on the server time zone. Returns `NaN` for invalid
 * input. Week 1 is the week containing the first Thursday of the ISO year, so
 * late-December dates can legitimately fall into week 1 of the next year.
 */
export function isoWeek(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return NaN;
  // Monday = 0 … Sunday = 6.
  const day = (d.getUTCDay() + 6) % 7;
  // Thursday of the week containing `d` — it pins the ISO year.
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
  return 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000));
}

/**
 * Day of year (1-366) for a `YYYY-MM-DD` date, computed in UTC. Returns `NaN`
 * for invalid input.
 */
export function dayOfYear(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return NaN;
  const start = Date.UTC(d.getUTCFullYear(), 0, 0); // Dec 31 of the previous year
  return Math.round((d.getTime() - start) / 86400000);
}
