import type { Country } from "./types";

// Curated country catalogue for the selector and holiday pages. Nager.Date
// supports 200+ countries; this is the Tier-A+B subset (151 entries) covering
// the markets with real search demand. See ADR-001 §7.
//
// Field policy for the entries beyond the original 16 popular markets:
//  - `name`: exactly the Nager `name` string, so lookups stay in sync upstream.
//  - `nameZh`: only on the original hand-curated set; getCountryName() falls back
//    through Intl.DisplayNames then `name`, so omitting it is safe.
//  - `popular`: only on the original homepage grid; not diluted by the expansion.
export const COUNTRIES: Country[] = [
  { code: "US", nameZh: "美国", name: "United States", popular: true },
  { code: "GB", nameZh: "英国", name: "United Kingdom", popular: true },
  { code: "CA", nameZh: "加拿大", name: "Canada", popular: true },
  { code: "AU", nameZh: "澳大利亚", name: "Australia", popular: true },
  { code: "DE", nameZh: "德国", name: "Germany", popular: true },
  { code: "FR", nameZh: "法国", name: "France", popular: true },
  { code: "ES", nameZh: "西班牙", name: "Spain", popular: true },
  { code: "IT", nameZh: "意大利", name: "Italy", popular: true },
  { code: "NL", nameZh: "荷兰", name: "Netherlands", popular: true },
  { code: "IE", nameZh: "爱尔兰", name: "Ireland", popular: true },
  { code: "SE", nameZh: "瑞典", name: "Sweden", popular: true },
  { code: "CH", nameZh: "瑞士", name: "Switzerland", popular: true },
  { code: "AT", nameZh: "奥地利", name: "Austria", popular: true },
  { code: "BE", nameZh: "比利时", name: "Belgium", popular: true },
  { code: "PT", nameZh: "葡萄牙", name: "Portugal", popular: true },
  { code: "PL", nameZh: "波兰", name: "Poland", popular: true },
  { code: "JP", nameZh: "日本", name: "Japan" },
  { code: "KR", nameZh: "韩国", name: "South Korea" },
  { code: "CN", nameZh: "中国", name: "China" },
  { code: "IN", nameZh: "印度", name: "India", popular: true },
  { code: "BR", nameZh: "巴西", name: "Brazil", popular: true },
  { code: "MX", nameZh: "墨西哥", name: "Mexico", popular: true },
  { code: "AR", nameZh: "阿根廷", name: "Argentina" },
  { code: "ZA", nameZh: "南非", name: "South Africa" },
  { code: "SG", nameZh: "新加坡", name: "Singapore" },
  { code: "AE", nameZh: "阿联酋", name: "United Arab Emirates" },
  { code: "NZ", nameZh: "新西兰", name: "New Zealand" },
  { code: "DK", nameZh: "丹麦", name: "Denmark" },
  { code: "NO", nameZh: "挪威", name: "Norway" },
  { code: "FI", nameZh: "芬兰", name: "Finland" },
  { code: "CZ", nameZh: "捷克", name: "Czechia" },
  { code: "GR", nameZh: "希腊", name: "Greece" },
  { code: "HU", nameZh: "匈牙利", name: "Hungary" },
  { code: "RO", nameZh: "罗马尼亚", name: "Romania" },
  { code: "TR", nameZh: "土耳其", name: "Turkey" },
  { code: "RU", nameZh: "俄罗斯", name: "Russia" },
  { code: "TH", nameZh: "泰国", name: "Thailand" },
  { code: "MY", nameZh: "马来西亚", name: "Malaysia" },
  { code: "ID", nameZh: "印度尼西亚", name: "Indonesia" },
  { code: "PH", nameZh: "菲律宾", name: "Philippines" },
  { code: "HK", nameZh: "中国香港", name: "Hong Kong" },
  { code: "TW", nameZh: "中国台湾", name: "Taiwan" },
  { code: "NG", nameZh: "尼日利亚", name: "Nigeria" },
  { code: "EG", nameZh: "埃及", name: "Egypt" },
  { code: "SA", nameZh: "沙特阿拉伯", name: "Saudi Arabia" },
  { code: "IL", nameZh: "以色列", name: "Israel" },
  // ---- Tier-A expansion (+64, all verified to return 2026 data) ----
  // Europe
  { code: "IS", name: "Iceland" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "SI", name: "Slovenia" },
  { code: "SK", name: "Slovakia" },
  { code: "HR", name: "Croatia" },
  { code: "RS", name: "Serbia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "MK", name: "North Macedonia" },
  { code: "AL", name: "Albania" },
  { code: "ME", name: "Montenegro" },
  { code: "BG", name: "Bulgaria" },
  { code: "UA", name: "Ukraine" },
  { code: "BY", name: "Belarus" },
  { code: "MD", name: "Moldova" },
  { code: "GE", name: "Georgia" },
  { code: "AM", name: "Armenia" },
  // Asia-Pacific
  { code: "VN", name: "Vietnam" },
  { code: "KH", name: "Cambodia" },
  { code: "BD", name: "Bangladesh" },
  { code: "MN", name: "Mongolia" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "PG", name: "Papua New Guinea" },
  // MENA
  { code: "BH", name: "Bahrain" },
  { code: "IQ", name: "Iraq" },
  { code: "MA", name: "Morocco" },
  { code: "DZ", name: "Algeria" },
  { code: "TN", name: "Tunisia" },
  // Sub-Saharan Africa
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "ET", name: "Ethiopia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "ZM", name: "Zambia" },
  { code: "MZ", name: "Mozambique" },
  { code: "AO", name: "Angola" },
  { code: "CM", name: "Cameroon" },
  { code: "CI", name: "Ivory Coast" },
  { code: "SN", name: "Senegal" },
  // Americas
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "BO", name: "Bolivia" },
  { code: "PY", name: "Paraguay" },
  { code: "UY", name: "Uruguay" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panama" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "SV", name: "El Salvador" },
  { code: "NI", name: "Nicaragua" },
  { code: "DO", name: "Dominican Republic" },
  { code: "CU", name: "Cuba" },
  { code: "JM", name: "Jamaica" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "PR", name: "Puerto Rico" },
  { code: "BS", name: "Bahamas" },
  // ---- Tier-B expansion (+41, all verified to return 2026 data) ----
  // Sub-Saharan Africa
  { code: "CD", name: "DR Congo" },
  { code: "SD", name: "Sudan" },
  { code: "MG", name: "Madagascar" },
  { code: "ML", name: "Mali" },
  { code: "BF", name: "Burkina Faso" },
  { code: "NE", name: "Niger" },
  { code: "MW", name: "Malawi" },
  { code: "TD", name: "Chad" },
  { code: "GN", name: "Guinea" },
  { code: "BI", name: "Burundi" },
  { code: "RW", name: "Rwanda" },
  { code: "BJ", name: "Benin" },
  { code: "TG", name: "Togo" },
  { code: "SL", name: "Sierra Leone" },
  { code: "LR", name: "Liberia" },
  { code: "SO", name: "Somalia" },
  { code: "SS", name: "South Sudan" },
  { code: "MR", name: "Mauritania" },
  { code: "ER", name: "Eritrea" },
  { code: "LY", name: "Libya" },
  { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" },
  { code: "LS", name: "Lesotho" },
  { code: "GA", name: "Gabon" },
  { code: "SZ", name: "Eswatini" },
  { code: "GM", name: "Gambia" },
  { code: "CF", name: "Central African Republic" },
  { code: "CG", name: "Congo" },
  // MENA
  { code: "YE", name: "Yemen" },
  { code: "SY", name: "Syria" },
  { code: "DJ", name: "Djibouti" },
  // Caribbean
  { code: "HT", name: "Haiti" },
  { code: "BB", name: "Barbados" },
  { code: "LC", name: "Saint Lucia" },
  { code: "GD", name: "Grenada" },
  // South America
  { code: "GY", name: "Guyana" },
  { code: "SR", name: "Suriname" },
  // Europe
  { code: "LI", name: "Liechtenstein" },
  { code: "MC", name: "Monaco" },
  { code: "SM", name: "San Marino" },
  { code: "AD", name: "Andorra" },
];

// Countries kept in the catalogue but with no upstream Nager data (HTTP 204).
// India, Thailand, Malaysia, Israel and the UAE are large query markets, so the
// entries stay; the pages render a noindex empty state and are excluded from
// every sitemap. See ADR-001 §7.4 / SPEC §9.
export const NO_DATA_COUNTRIES = new Set([
  "IN",
  "AE",
  "TH",
  "MY",
  "TW",
  "SA",
  "IL",
]);

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

// Demonyms per country — used to compose natural English phrases such as
// "Austrian bank holiday" / "Swiss public holidays" so country pages also
// rank for adjective-form queries. getDemonym() falls back to the country name.
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
  // ---- Tier-A expansion demonyms ----
  IS: "Icelandic", LU: "Luxembourgish", MT: "Maltese", CY: "Cypriot",
  EE: "Estonian", LV: "Latvian", LT: "Lithuanian", SI: "Slovenian",
  SK: "Slovak", HR: "Croatian", RS: "Serbian", BA: "Bosnian",
  MK: "Macedonian", AL: "Albanian", ME: "Montenegrin", BG: "Bulgarian",
  UA: "Ukrainian", BY: "Belarusian", MD: "Moldovan", GE: "Georgian",
  AM: "Armenian", VN: "Vietnamese", KH: "Cambodian", BD: "Bangladeshi",
  MN: "Mongolian", KZ: "Kazakh", PG: "Papua New Guinean", BH: "Bahraini",
  IQ: "Iraqi", MA: "Moroccan", DZ: "Algerian", TN: "Tunisian",
  KE: "Kenyan", GH: "Ghanaian", TZ: "Tanzanian", UG: "Ugandan",
  ET: "Ethiopian", ZW: "Zimbabwean", ZM: "Zambian", MZ: "Mozambican",
  AO: "Angolan", CM: "Cameroonian", CI: "Ivorian", SN: "Senegalese",
  CL: "Chilean", CO: "Colombian", PE: "Peruvian", VE: "Venezuelan",
  EC: "Ecuadorian", BO: "Bolivian", PY: "Paraguayan", UY: "Uruguayan",
  CR: "Costa Rican", PA: "Panamanian", GT: "Guatemalan", HN: "Honduran",
  SV: "Salvadoran", NI: "Nicaraguan", DO: "Dominican", CU: "Cuban",
  JM: "Jamaican", TT: "Trinidadian", PR: "Puerto Rican", BS: "Bahamian",
  // ---- Tier-B expansion demonyms ----
  CD: "Congolese", SD: "Sudanese", MG: "Malagasy", ML: "Malian",
  BF: "Burkinabe", NE: "Nigerien", MW: "Malawian", TD: "Chadian",
  GN: "Guinean", BI: "Burundian", RW: "Rwandan", BJ: "Beninese",
  TG: "Togolese", SL: "Sierra Leonean", LR: "Liberian", SO: "Somali",
  SS: "South Sudanese", MR: "Mauritanian", ER: "Eritrean", LY: "Libyan",
  BW: "Botswanan", NA: "Namibian", LS: "Basotho", GA: "Gabonese",
  SZ: "Swazi", GM: "Gambian", CF: "Central African", CG: "Congolese",
  YE: "Yemeni", SY: "Syrian", DJ: "Djiboutian", HT: "Haitian",
  BB: "Barbadian", LC: "Saint Lucian", GD: "Grenadian",
  GY: "Guyanese", SR: "Surinamese",
  LI: "Liechtensteiner", MC: "Monegasque", SM: "Sammarinese", AD: "Andorran",
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

// Interrogative title / description frames for the single-holiday detail page.
// {name} stays English in every locale (ADR-001 §10.2); {country} is localised
// via getCountryName; {year}/{date} are interpolated. Title logic is kept
// self-contained in this module, mirroring getHolidayPageTitle (ADR-001 §10.3).
// These frames are duplicated in messages/*.json → holidayDetail.metaTitle /
// metaDescription for translation-completeness; keep the two in sync.
const HOLIDAY_DETAIL_TITLE_FRAMES: Record<string, string> = {
  en: "When Is {name} in {country} in {year}? Date, Day & Details",
  zh: "{name}（{country}）{year}年是哪一天？日期与放假安排",
  ja: "{country}の{name}{year}年はいつ？日付・曜日・詳細",
  ko: "{country} {name} {year}년은 언제? 날짜·요일·상세 정보",
  es: "¿Cuándo es {name} en {country} en {year}? Fecha, día y detalles",
  de: "Wann ist {name} in {country} {year}? Datum, Wochentag & Details",
  fr: "Quand a lieu {name} en {country} en {year} ? Date, jour et détails",
  pt: "Quando é {name} em {country} em {year}? Data, dia e detalhes",
  it: "Quando è {name} in {country} nel {year}? Data, giorno e dettagli",
  ru: "Когда {name} в стране {country} в {year} году? Дата, день, детали",
  ar: "متى {name} في {country} في {year}؟ التاريخ واليوم والتفاصيل",
};

const HOLIDAY_DETAIL_DESC_FRAMES: Record<string, string> = {
  en: "{name} in {country} {year}: {date}. See the weekday, whether it is a nationwide public holiday, the countdown and long-weekend tips.",
  zh: "{name}（{country}）{year}年：{date}。查看星期几、是否为全国性公共假期、倒计时天数与长周末攻略。",
  ja: "{country}の{name}（{year}年）：{date}。曜日、全国的な祝日かどうか、残り日数、連休のヒントを確認できます。",
  ko: "{country} {name}({year}년): {date}. 요일, 전국 공휴일 여부, 남은 일수, 연휴 팁을 확인하세요.",
  es: "{name} en {country} {year}: {date}. Consulta el día de la semana, si es festivo nacional, la cuenta atrás y consejos para el puente.",
  de: "{name} in {country} {year}: {date}. Wochentag, ob landesweiter Feiertag, Countdown und Brückentag-Tipps auf einen Blick.",
  fr: "{name} en {country} {year} : {date}. Jour de la semaine, s'il s'agit d'un jour férié national, compte à rebours et astuces de pont.",
  pt: "{name} em {country} {year}: {date}. Veja o dia da semana, se é feriado nacional, a contagem regressiva e dicas de feriado prolongado.",
  it: "{name} in {country} {year}: {date}. Giorno della settimana, se è festività nazionale, conto alla rovescia e consigli per il ponte.",
  ru: "{name} в стране {country}, {year}: {date}. День недели, общенациональный ли это праздник, обратный отсчёт и советы по длинным выходным.",
  ar: "{name} في {country} {year}: {date}. يوم الأسبوع، وما إذا كان عطلة رسمية وطنية، والعدّ التنازلي ونصائح لعطلة نهاية أسبوع طويلة.",
};

/**
 * Build the locale-aware <title> for a single-holiday detail page.
 * {name} is the English holiday name (never machine-translated).
 */
export function getHolidayDetailTitle(
  holidayName: string,
  countryCode: string,
  locale: string,
  year: number
): string {
  const country = getCountryName(countryCode, locale);
  const frame = HOLIDAY_DETAIL_TITLE_FRAMES[locale] ?? HOLIDAY_DETAIL_TITLE_FRAMES.en;
  return frame
    .replace("{name}", holidayName)
    .replace("{country}", country)
    .replace("{year}", String(year));
}

/**
 * Build the locale-aware meta description for a single-holiday detail page.
 * `dateLabel` is a pre-formatted, localised date string from the caller.
 */
export function getHolidayDetailDescription(
  holidayName: string,
  countryCode: string,
  locale: string,
  year: number,
  dateLabel: string
): string {
  const country = getCountryName(countryCode, locale);
  const frame = HOLIDAY_DETAIL_DESC_FRAMES[locale] ?? HOLIDAY_DETAIL_DESC_FRAMES.en;
  return frame
    .replace("{name}", holidayName)
    .replace("{country}", country)
    .replace("{year}", String(year))
    .replace("{date}", dateLabel);
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
