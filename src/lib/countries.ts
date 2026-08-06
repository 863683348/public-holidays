import type { Country } from "./types";

// Curated list for the selector. Nager.Date supports 120+ countries; this covers
// the most common markets for an overseas audience. Extend as needed.
export const COUNTRIES: Country[] = [
  { code: "US",
  nameZh: "\u7f8e\u56fd", name: "United States", popular: true },
  { code: "GB",
  nameZh: "\u82f1\u56fd", name: "United Kingdom", popular: true },
  { code: "CA",
  nameZh: "\u52a0\u62ff\u5927", name: "Canada", popular: true },
  { code: "AU",
  nameZh: "\u6fb3\u5927\u5229\u4e9a", name: "Australia", popular: true },
  { code: "DE",
  nameZh: "\u5fb7\u56fd", name: "Germany", popular: true },
  { code: "FR",
  nameZh: "\u6cd5\u56fd", name: "France", popular: true },
  { code: "ES",
  nameZh: "\u897f\u73ed\u7259", name: "Spain", popular: true },
  { code: "IT",
  nameZh: "\u610f\u5927\u5229", name: "Italy", popular: true },
  { code: "NL",
  nameZh: "\u8377\u5170", name: "Netherlands", popular: true },
  { code: "IE",
  nameZh: "\u7231\u5c14\u5170", name: "Ireland", popular: true },
  { code: "SE",
  nameZh: "\u745e\u5178", name: "Sweden", popular: true },
  { code: "CH",
  nameZh: "\u745e\u58eb", name: "Switzerland", popular: true },
  { code: "AT",
  nameZh: "\u5965\u5730\u5229", name: "Austria", popular: true },
  { code: "BE",
  nameZh: "\u6bd4\u5229\u65f6", name: "Belgium", popular: true },
  { code: "PT",
  nameZh: "\u8461\u8404\u7259", name: "Portugal", popular: true },
  { code: "PL",
  nameZh: "\u6ce2\u5170", name: "Poland", popular: true },
  { code: "JP",
  nameZh: "\u65e5\u672c", name: "Japan" },
  { code: "KR",
  nameZh: "\u97e9\u56fd", name: "South Korea" },
  { code: "CN",
  nameZh: "\u4e2d\u56fd", name: "China" },
  { code: "IN",
  nameZh: "\u5370\u5ea6", name: "India", popular: true },
  { code: "BR",
  nameZh: "\u5df4\u897f", name: "Brazil", popular: true },
  { code: "MX",
  nameZh: "\u58a8\u897f\u54e5", name: "Mexico", popular: true },
  { code: "AR",
  nameZh: "\u963f\u6839\u5ef7", name: "Argentina" },
  { code: "ZA",
  nameZh: "\u5357\u975e", name: "South Africa" },
  { code: "SG",
  nameZh: "\u65b0\u52a0\u5761", name: "Singapore" },
  { code: "AE",
  nameZh: "\u963f\u8054\u914b", name: "United Arab Emirates" },
  { code: "NZ",
  nameZh: "\u65b0\u897f\u5170", name: "New Zealand" },
  { code: "DK",
  nameZh: "\u4e39\u9ea6", name: "Denmark" },
  { code: "NO",
  nameZh: "\u632a\u5a01", name: "Norway" },
  { code: "FI",
  nameZh: "\u82ac\u5170", name: "Finland" },
  { code: "CZ",
  nameZh: "\u6377\u514b", name: "Czechia" },
  { code: "GR",
  nameZh: "\u5e0c\u814a", name: "Greece" },
  { code: "HU",
  nameZh: "\u5308\u7259\u5229", name: "Hungary" },
  { code: "RO",
  nameZh: "\u7f57\u9a6c\u5c3c\u4e9a", name: "Romania" },
  { code: "TR",
  nameZh: "\u571f\u8033\u5176", name: "Turkey" },
  { code: "RU",
  nameZh: "\u4fc4\u7f57\u65af", name: "Russia" },
  { code: "TH",
  nameZh: "\u6cf0\u56fd", name: "Thailand" },
  { code: "MY",
  nameZh: "\u9a6c\u6765\u897f\u4e9a", name: "Malaysia" },
  { code: "ID",
  nameZh: "\u5370\u5ea6\u5c3c\u897f\u4e9a", name: "Indonesia" },
  { code: "PH",
  nameZh: "\u83f2\u5f8b\u5bbe", name: "Philippines" },
  { code: "HK",
  nameZh: "\u4e2d\u56fd\u9999\u6e2f", name: "Hong Kong" },
  { code: "TW",
  nameZh: "\u4e2d\u56fd\u53f0\u6e7e", name: "Taiwan" },
  { code: "NG",
  nameZh: "\u5c3c\u65e5\u5229\u4e9a", name: "Nigeria" },
  { code: "EG",
  nameZh: "\u57c3\u53ca", name: "Egypt" },
  { code: "SA",
  nameZh: "\u6c99\u7279\u963f\u62c9\u4f2f", name: "Saudi Arabia" },
  { code: "IL",
  nameZh: "\u4ee5\u8272\u5217", name: "Israel" },
];

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
}



export function getCountryName(code: string, locale?: string): string {
  const c = getCountry(code);
  if (!c) return code;
  // Prefer a hand-curated zh name when available.
  if (locale === "zh" && c.nameZh) return c.nameZh;
  // Localize country name via native Intl.DisplayNames for all other locales.
  if (locale && locale !== "en") {
    try {
      const localized = new Intl.DisplayNames([locale], { type: "region" }).of(code);
      if (localized && localized !== code) return localized;
    } catch {
      // Intl unavailable — fall through to English name.
    }
  }
  return c.name;
}

// Localized "public holidays" term per locale — used to compose SEO <title>
// tags that match the exact query phrasing Google already ranks us for
// (e.g. Japanese "ポーランド 祝日 2026", Korean "오스트리아 공휴일 2026").
const HOLIDAY_TERMS: Record<string, string> = {
  en: "Public Holidays",
  zh: "公共假期",
  ja: "祝日",
  ko: "공휴일",
  es: "festivos",
  de: "Feiertage",
  fr: "jours fériés",
  pt: "feriados",
  it: "festività",
  ru: "праздники",
  ar: "عطل",
};

/**
 * Build a locale-aware <title> for a country/year holiday page.
 * For English we keep the brand pattern + the "Calendar & Bridge Days"
 * modifiers (both real search terms). For every other locale we localize
 * the country name (via Intl.DisplayNames) and the "public holidays" term so
 * the title mirrors the native query string.
 */
// Demonyms per country — used to compose natural English phrases such as
// "Austrian bank holiday" / "Swiss public holidays" so country pages also
// rank for adjective-form queries (e.g. "austrian bank holiday",
// "swiss public holidays", "brazilian bank holiday").
const DEMONYMS: Record<string, string> = {
  US: "American", GB: "British", CA: "Canadian", AU: "Australian",
  DE: "German", FR: "French", ES: "Spanish", IT: "Italian",
  NL: "Dutch", IE: "Irish", SE: "Swedish", CH: "Swiss",
  AT: "Austrian", BE: "Belgian", PT: "Portuguese", PL: "Polish",
  JP: "Japanese", KR: "South Korean", CN: "Chinese", IN: "Indian",
  BR: "Brazilian", MX: "Mexican", AR: "Argentine", ZA: "South African",
  SG: "Singaporean", AE: "Emirati", NZ: "New Zealander", DK: "Danish",
  NO: "Norwegian", FI: "Finnish", CZ: "Czech", GR: "Greek",
  HU: "Hungarian", RO: "Romanian", TR: "Turkish", RU: "Russian",
  TH: "Thai", MY: "Malaysian", ID: "Indonesian", PH: "Filipino",
  HK: "Hong Kong", TW: "Taiwanese", NG: "Nigerian", EG: "Egyptian",
  SA: "Saudi", IL: "Israeli",
};

export function getDemonym(code: string): string {
  const c = getCountry(code);
  if (!c) return code;
  return DEMONYMS[c.code.toUpperCase()] ?? c.name;
}

export function getHolidayPageTitle(code: string, locale: string, year: number): string {
  const meta = getCountry(code);
  if (!meta) return `${code} ${year}`;
  if (locale === "en") {
    return `${meta.name} Public Holidays ${year} — Full List & Official Dates`;
  }
  const term = HOLIDAY_TERMS[locale] ?? "Public Holidays";
  const name = getCountryName(code, locale);
  if (locale === "zh") {
    return `${name} ${year}年${term}完整列表（官方日期）`;
  }
  return `${name} ${term} ${year} — Full List`;
}

/**
 * Locale-aware meta description with high-intent CTR hooks:
 * "official dates", "full list", "download / print / free calendar".
 * Used by both the country landing page and the country×year pages.
 */
export function getHolidayPageDescription(code: string, locale: string, year: number): string {
  const meta = getCountry(code);
  if (!meta) return `${year} public holidays — full list and official dates.`;
  if (locale === "zh") {
    return `${meta.name}${year}年公共假期完整列表：含官方日期、桥梁日与长周末，可免费下载并打印日历。`;
  }
  return `Complete ${year} ${meta.name} public holidays list with official dates, bridge days and long weekends. Download or print your free calendar.`;
}

// Curated official government sources for the top markets. Rendered as the
// "Official source" E-E-A-T link on country / year pages. Only confident,
// stable government URLs are included; other countries omit the link.
const OFFICIAL_SOURCES: Record<string, string> = {
  US: "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/",
  GB: "https://www.gov.uk/bank-holidays",
  CA: "https://www.canada.ca/en/services/culture/holidays.html",
  AU: "https://www.australia.gov.au/public-holidays",
  FR: "https://www.service-public.fr/particuliers/vosdroits/F2367",
  ES: "https://www.boe.es/calendario.php",
  NL: "https://www.rijksoverheid.nl/onderwerpen/feestdagen",
  AT: "https://www.help.gv.at/",
  JP: "https://www8.cao.go.jp/syukujitsu/",
};

export function getOfficialSource(code: string): string | undefined {
  const c = getCountry(code);
  return c ? OFFICIAL_SOURCES[c.code.toUpperCase()] : undefined;
}

export const POPULAR_COUNTRIES = COUNTRIES.filter((c) => c.popular);
