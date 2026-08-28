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
  nl: "feestdagen",
};

// Localized meta-description frames for non-zh/non-en country pages.
// Mirrors the Japanese "チェコ 祝日" pattern that already ranks (pos 15):
// fully localized query phrasing in the description — not just the title —
// so each high-potential locale (ja/de/fr/es/ko/…) matches its own-language
// searches (e.g. "tschechien feiertage", "jours fériés tchéquie").
// {name} = localized country name (via getCountryName), {year} = the year.
const HOLIDAY_DESC_FRAMES: Record<string, string> = {
  ja: "{name}の{year}年祝日一覧：公式日程、連休・振替休日もチェック。カレンダーを無料でダウンロード・印刷できます。",
  ko: "{name} {year}년 공휴일 전체 목록: 공식 날짜, 연휴와 브리지데이. 달력을 무료로 다운로드하고 인쇄하세요.",
  es: "Lista completa de los festivos de {name} en {year}: fechas oficiales, puentes y fines de semana largos. Descarga o imprime tu calendario gratis.",
  de: "Alle Feiertage in {name} {year}: offizielle Daten, Brückentage und verlängerte Wochenenden. Kalender kostenlos herunterladen oder drucken.",
  fr: "Liste complète des jours fériés en {name} en {year} : dates officielles, ponts et week-ends prolongés. Téléchargez ou imprimez votre calendrier gratuitement.",
  pt: "Lista completa de feriados em {name} em {year}: datas oficiais, pontes e fins de semana prolongados. Baixe ou imprima seu calendário grátis.",
  it: "Elenco completo dei giorni festivi in {name} nel {year}: date ufficiali, ponti e weekend lunghi. Scarica o stampa il tuo calendario gratis.",
  ru: "Полный список праздников в {name} на {year} год: официальные даты, длинные выходные и мосты. Скачайте или распечатайте календарь бесплатно.",
  ar: "القائمة الكاملة للعطلات في {name} لعام {year}: تواريخ رسمية وعطلات نهاية أسبوع طويلة. حمّل التقويم أو اطبعه مجانًا.",
  nl: "Volledige lijst van feestdagen in {name} {year}: officiële data, brugdagen en lange weekenden. Download of print uw kalender gratis.",
  en: "Complete {year} {name} holidays list with official dates, bridge days and long weekends. Download or print your free calendar.",
};

// Country-specific holiday terminology for English titles/descriptions.
// Targets the exact high-impression queries seen in GSC (e.g. "uk bank
// holidays", "us federal holidays"); generic "Public Holidays" is the fallback.
const COUNTRY_HOLIDAY_TERM_EN: Record<string, string> = {
  GB: "Bank Holidays",
  US: "Federal Holidays",
  CA: "Statutory Holidays",
  AU: "Public Holidays",
  IE: "Public Holidays",
  NZ: "Public Holidays",
};

// Neighboring / closely-related markets per country — powers the "Related
// countries" internal-linking block on country pages (cross-country crawl
// paths + user discovery). Tier-A markets only; a missing code renders no
// chips, so coverage can grow incrementally.
export const RELATED_COUNTRIES: Record<string, string[]> = {
  GB: ["IE", "FR", "DE", "NL", "US", "CA", "AU", "ES"],
  US: ["CA", "GB", "MX", "AU", "FR", "DE", "JP"],
  CA: ["US", "GB", "MX", "AU", "FR"],
  AU: ["NZ", "GB", "US", "CA", "SG"],
  NZ: ["AU", "GB", "US"],
  IE: ["GB", "FR", "DE", "NL", "US"],
  DE: ["AT", "CH", "FR", "NL", "GB", "PL", "CZ"],
  FR: ["BE", "DE", "ES", "IT", "GB", "NL"],
  ES: ["PT", "FR", "IT", "GB", "DE"],
  IT: ["FR", "ES", "DE", "AT", "GB"],
  NL: ["DE", "BE", "FR", "GB"],
  PT: ["ES", "FR", "BR", "GB"],
  PL: ["DE", "CZ", "GB", "US"],
  AT: ["DE", "CH", "IT", "CZ", "HU"],
  CH: ["DE", "FR", "IT", "AT"],
  BE: ["FR", "NL", "DE", "GB"],
  JP: ["KR", "CN", "US", "GB"],
  KR: ["JP", "CN", "US"],
  CN: ["JP", "KR", "HK", "TW", "US"],
  HK: ["CN", "TW", "SG", "GB"],
  TW: ["CN", "HK", "JP", "US"],
  IN: ["GB", "US", "AE", "SG"],
  BR: ["PT", "US", "AR", "MX", "FR"],
  MX: ["US", "ES", "BR", "CA"],
  AR: ["BR", "ES", "MX", "US"],
  SG: ["MY", "ID", "GB", "AU"],
  AE: ["IN", "GB", "US", "SA"],
  CZ: ["SK", "DE", "AT", "PL"],
  SE: ["NO", "DK", "FI", "DE"],
  NO: ["SE", "DK", "FI"],
  DK: ["SE", "NO", "DE", "NL"],
  FI: ["SE", "NO", "EE"],
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
    const term = COUNTRY_HOLIDAY_TERM_EN[code] ?? "Public Holidays";
    return `${meta.name} ${term} ${year} — Full List & Official Dates`;
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
  if (locale === "en") {
    const enTerm = COUNTRY_HOLIDAY_TERM_EN[code] ?? "Public Holidays";
    return `Complete ${year} ${meta.name} ${enTerm.toLowerCase()} list with official dates, bridge days and long weekends. Download or print your free calendar.`;
  }
  // Localized description — same "native query phrasing" pattern as the
  // Japanese page that ranks for 「チェコ 祝日」(GSC: pos 15, CTR 100%).
  const frame = HOLIDAY_DESC_FRAMES[locale] ?? HOLIDAY_DESC_FRAMES.en;
  const name = getCountryName(code, locale);
  return frame.replace("{name}", name).replace("{year}", String(year));
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

// Curated, country-specific insight copy for the high-potential markets
// (A-tier pages: /en/AT, /en/SE, /en/BR, /en/GB). Rendered as a "Why X is
// different" block on the country landing page — turns the template page into
// differentiated content, adds topical keywords for the target market, and
// carries an internal link to the page's own year view (deep-link for crawlers).
//
// `why`: 2-3 sentences of factual, non-duplicated insight (bridges / regional
//        days / unique traditions / transfer rules) — E-E-A-T friendly.
// `keyword`: the market's native search phrasing (used in the link anchor).
// `linkYear`: the year segment to deep-link to (current-year page gets the
//             freshest content; crawlers follow the anchor).
export const COUNTRY_INSIGHTS: Record<
  string,
  { why: string; keyword: string; linkYear: (year: number) => number }
> = {
  AT: {
    why: "Austrian public holidays are notable for their strong regional character: nine of the thirteen nationwide days are shared with the whole country, but each Bundesland adds its own local days such as the Heiliger Leopold in Lower Austria. Bridge days (Zwickeltage) matter here more than almost anywhere else in Europe, because many workers take a single day off to create a long weekend around a Tuesday or Thursday holiday.",
    keyword: "Feiertage Österreich",
    linkYear: (y) => y + 1,
  },
  SE: {
    why: "Swedish public holidays include several unique traditions you will not find elsewhere: Midsummer (Midsommardagen) is the biggest celebration of the year, the National Day was only made a full public holiday in 2005, and many holidays like Epiphany and All Saints' Day are flanked by 'squeeze days' (klämdagar) when most Swedes take a single day off to extend the break. Public holidays that fall on a weekend are not automatically moved to the next working day, unlike in many other countries.",
    keyword: "helgdagar Sverige",
    linkYear: (y) => y + 1,
  },
  BR: {
    why: "Brazilian public holidays mix civic and religious days, with Carnaval (the Monday and Tuesday before Ash Wednesday) being the most distinctive — it is widely observed in practice even though it is not an official nationwide public holiday. Several days are 'movable' (calculated from Easter), so the exact dates change every year. Banks and federal offices follow the official calendar, while many states and municipalities add their own local holidays.",
    keyword: "feriados Brasil",
    linkYear: (y) => y + 1,
  },
  GB: {
    why: "The UK runs on a system of bank holidays set by royal proclamation rather than fixed statute, so the dates shift every year — the May Day holiday and the late-summer August bank holiday are always the first or last Monday of the month. Boxing Day (26 December) and the early May bank holiday are unique to the UK, and when Christmas or New Year falls on a weekend the holiday moves to the next working day (a 'substitute day').",
    keyword: "UK bank holidays",
    linkYear: (y) => y + 1,
  },
};

/** Returns the curated insight for a country, or undefined for uncurated ones. */
export function getCountryInsight(code: string): (typeof COUNTRY_INSIGHTS)[string] | undefined {
  return COUNTRY_INSIGHTS[code.toUpperCase()];
}

/**
 * Country feature blocks for near-win keyword harvesting.
 *
 * Used on country×year pages (after the insight block, before the calendar) to add
 * non-duplicated, locale-specific editorial content that targets high-intent queries
 * currently ranking at positions 6–10 in GSC.
 *
 * Structure: { [countryCode]: { [locale]: { heading: string; text: string; links: Array<{label, href}> } } }
 * Return undefined when no block exists for the given country+locale combo.
 */
export const COUNTRY_FEATURE_BLOCK: Record<string, Record<string, { heading: string; text: string; links: Array<{ label: string; href: string }> }>> = {
  // ---- English: Labour Day comparison (targets "labour day 2026", "labor weekend 2026") ----
  CA: {
    en: {
      heading: "Canada's Labour Day 2026: Your Long Weekend Guide",
      text: "Canada's Labour Day falls on Monday, September 7, 2026 — the first Monday of September. This marks the unofficial end of summer and creates a perfect three-day weekend for travel or staycations. Unlike the US (which shares the same date), Canada's Labour Day is a statutory holiday across all provinces and territories. If you're planning a road trip, book accommodation early — September is peak fall-colour season in Eastern Canada.",
      links: [
        { label: "Canada 2026 holidays", href: "/CA/2026" },
        { label: "US Labour Day comparison", href: "/US/2026" },
        { label: "Long weekend planner", href: "/blog/long-weekend-opportunities-46-countries-2027-guide" },
      ],
    },
  },
  US: {
    en: {
      heading: "US Labor Day 2026: The Ultimate Long Weekend",
      text: "Labor Day 2026 lands on Monday, September 7 — the first Monday of September. This federal holiday honors American workers and kicks off fall with a three-day weekend. In 2026, it's especially valuable because it falls right before the school year starts, making it ideal for family trips. Note: Labor Day is also observed in Canada (same date), but the US and Canada have different holiday traditions.",
      links: [
        { label: "US federal holidays 2026", href: "/US/2026" },
        { label: "Canada Labour Day", href: "/CA/2026" },
        { label: "New Zealand Labour Day", href: "/NZ/2026" },
      ],
    },
  },
  NZ: {
    en: {
      heading: "New Zealand Labour Day 2026: A Four-Day Weekend",
      text: "New Zealand celebrates Labour Day on Monday, October 26, 2026 — the fourth Monday of September. Yes, it's later than the US and Canada! This gives Kiwis a four-day weekend (Fri–Mon) if you count the Friday before. It's a great time for trout fishing, hiking in the Southern Alps, or exploring Auckland's harbours. The date is fixed by the Labour Day and Anzac Day Adjustment Act 1943.",
      links: [
        { label: "New Zealand 2026 holidays", href: "/NZ/2026" },
        { label: "Australia Labour Day", href: "/AU/2026" },
        { label: "Compare with US/CA", href: "/compare?c=US,CA,NZ&y=2026" },
      ],
    },
  },
  AU: {
    en: {
      heading: "Australia's Labour Day 2026: It Depends Where You Are",
      text: "Australia doesn't have a single Labour Day date — each state and territory celebrates on a different Monday. In 2026: Western Australia (WA) celebrates on March 2, Victoria (VIC) on March 9, Northern Territory (NT) on May 4 (as May Day), Queensland (QLD) on May 4, and ACT/NSW/South Australia (SA) on October 5. This regional variation is unique among English-speaking countries and makes Australia's calendar particularly interesting for travelers.",
      links: [
        { label: "Australia 2026 holidays by state", href: "/AU/2026" },
        { label: "Compare AU states", href: "/compare?c=NSW,VIC,WA&y=2026" },
        { label: "New Zealand Labour Day", href: "/NZ/2026" },
      ],
    },
  },
  KR: {
    en: {
      heading: "South Korea Labour Day 2026: May 1st Celebration",
      text: "South Korea observes Labour Day (노동절, Nodongjeol) on May 1, 2026 — a Friday. This creates a natural three-day weekend with Saturday and Sunday. While not a法定 holiday (most businesses remain open), it's widely recognized and many workers take the day off. May 1st also falls between Buddha's Birthday (5/5) and Children's Day (5/5), making it part of a busy holiday period in spring.",
      links: [
        { label: "South Korea 2026 holidays", href: "/KR/2026" },
        { label: "Japan Golden Week 2026", href: "/JP/2026" },
        { label: "Labour Day around the world", href: "/blog/global-public-holidays-2027-complete-calendar" },
      ],
    },    ko: {
      heading: "한국 2026년 공휴일: 노동절과 긴 주말",
      text: "한국의 2026년 공휴일은 총 68일(국경일+대체공휴일 포함)입니다. 5월 1일 노동절은 법정공휴일은 아니지만 대부분의 기업이 휴무하며, 2026년에는 금요일에 있어 금·토·일 3일 연휴가 가능합니다. 설날(2월 17-19일)과 추석(9월 25-27일)에는 귀성ラのbiggest travel rush가 발생합니다. 어린이날(5월 5일)은 월요일이라 4일 연휴가 됩니다.",
      links: [
        { label: "한국 2026 공휴일 전체", href: "/ko/KR/2026" },
        { label: "일본 공휴일", href: "/ko/JP/2026" },
        { label: "긴 주말 계획 가이드", href: "/blog/long-weekend-opportunities-46-countries-2027-guide" },
      ],
    },

  },
  // ---- Korean (ko): Country feature blocks for near-win harvesting ----
  JP: {
    ko: {
      heading: "일본 2026년 공휴일: 골든 위크의 비밀",
      text: "일본의 2026년 공휴일은 총 16일로, 개발도상국 중 가장 많습니다. 4월 29일부터 5월 5일까지의 골든 위크는 7일 연속 휴일로, 일본에서 가장 긴 연휴입니다. 이 기간에는 항공편과 호텔 가격이 2-3배까지 오르니 미리 예약하세요. 5월 1일 노동절은 법정휴일은 아니지만 대부분의 기업이 휴무합니다.",
      links: [
        { label: "일본 2026년 공휴일 전체", href: "/ko/JP/2026" },
        { label: "한국 2026년 공휴일", href: "/ko/KR/2026" },
        { label: "골든 위크 여행 가이드", href: "/blog/long-weekend-opportunities-46-countries-2027-guide" },
      ],
    },    ja: {
      heading: "日本2026年の祝日：ゴールデンウィークの秘密",
      text: "日本の2026年の祝日は合計16日で、先進国中最也多いです。4月29日から5月5日のゴールデンウィークは7日連続の休日で、日本で最も長い連休です。この期間、航空券とホテルの価格は2-3倍まで上昇するので提前予約が必要です。5月1日の労働節は法定休日ではありませんが、ほとんどの企業が休業します。",
      links: [
        { label: "日本2026年祝日一覧", href: "/ja/JP/2026" },
        { label: "韓国2026年祝日", href: "/ja/KR/2026" },
        { label: "ゴールデンウィーク旅行ガイド", href: "/blog/long-weekend-opportunities-46-countries-2027-guide" },
      ],
    },

  },
  PL: {
    ko: {
      heading: "폴란드 2026년 공휴일: 13일의 달력",
      text: "폴란드는 2026년에 13개의 전국 공휴일을 가집니다. 주요holiday로는 새해(1/1), 세세례 예수(1/6), 부활절 월요일(4/6), 노동절(5/1), 헌법절(5/3), 성체축일(6/4), 천주교 성모승천날(8/15), 모든 성인 날(11/1), 독립기념일(11/11), 크리스마스(12/25)가 있습니다. 폴란드 공휴일은 대부분 가톨릭 전통과 얽혀 있어 다른 유럽 국가와 비교하면 흥미롭습니다.",
      links: [
        { label: "폴란드 2026 공휴일", href: "/ko/PL/2026" },
        { label: "오스트리아 공휴일", href: "/ko/AT/2026" },
        { label: "유럽 공휴일 비교", href: "/compare?c=PL,AT,CZ&y=2026" },
      ],
    },
  },
  AT: {
    ko: {
      heading: "오스트리아 2026년 공휴일: 주마다 다른 휴일",
      text: "오스트리아는 13개의 전국 공휴일 중 9개가 전국적으로庆祝되지만, 각 주(Bundesland)마다 고유한 지역 공휴일이 있습니다. 예컨대 저어오스트리아주는 성 레오폴트 날(11/15)을, 잘츠부르크주는 성 미카엘 날(9/29)을 기념합니다. 브리키타그(Зwickeltage) 문화가 발달해 화요일或목요일 휴일 주위에 하루를 꺼서 긴 주말을 만드는 것이 일반적입니다.",
      links: [
        { label: "오스트리아 2026 공휴일", href: "/ko/AT/2026" },
        { label: "독일 공휴일", href: "/ko/DE/2026" },
        { label: "브리키타그 가이드", href: "/blog/long-weekend-opportunities-46-countries-2027-guide" },
      ],
    },
  },
  HU: {
    ko: {
      heading: "헝가리 2026년 공휴일: 혁명 기념일의 의미",
      text: "헝가리의 2026년 공휴일은 13개입니다. 특히 3월 15일 1848년 혁명 기념일과 10월 23일 1956년 혁명 기념일은 헝가리 사람들에게 가장 중요한 날입니다. 이 두 날은 모두 2026년에 토요일과 일요일에 떨어져 대체 휴일이 없습니다. 5월 1일 노동절과 8월 20일 국경일(성 이シュ트반 기념일)도 중요한 national holiday입니다.",
      links: [
        { label: "헝가리 2026 공휴일", href: "/ko/HU/2026" },
        { label: "폴란드 공휴일", href: "/ko/PL/2026" },
        { label: "동유럽 공휴일 비교", href: "/compare?c=HU,PL,CZ&y=2026" },
      ],
    },
  },
  CO: {
    ko: {
      heading: "콜롬비아 2026년 공휴일: 카니발과 노동절",
      text: "콜롬비아는 2026년에 12개의 전국 공휴일을 가집니다. 가장 독특한 것은 카니발 월요일과 화요일(2월 16-17일)으로, 바랑키야 카니발은 콜롬비아에서 두 번째로 큰 축제로 알려져 있습니다. 5월 1일 노동절은 법정휴일이며, 7월 20일 독립기념일과 8월 7일 산 마르틴 전투 기념일도 중요합니다. 콜롬비아 공휴일은 가톨릭 절일과 독립 운동 기념일이 혼합되어 있습니다.",
      links: [
        { label: "콜롬비아 2026 공휴일", href: "/ko/CO/2026" },
        { label: "아르헨티나 공휴일", href: "/ko/AR/2026" },
        { label: "라틴아메리카 공휴일 비교", href: "/compare?c=CO,AR,BR&y=2026" },
      ],
    },
  },
  PT: {
    ko: {
      heading: "포르투갈 2026년 공휴일: 그리스도 절일과 페테이이라",
      text: "포르투갈은 2026년에 11개의 전국 공휴일을 가집니다. 특히 5월 1일 노동절, 7월 10일 포르투갈 날(국경일), 8월 15일 성모승천날, 10월 5일 공화국 선포 기념일, 11월 1일 모든 성인 날, 12월 8일 무염시태 성모 마리아 날이 독특합니다. 6월 10일 카몬스 날(포르투갈의 국가 시인)도 중요한 cultural holiday입니다.",
      links: [
        { label: "포르투갈 2026 공휴일", href: "/ko/PT/2026" },
        { label: "스페인 공휴일", href: "/ko/ES/2026" },
        { label: "유럽 공휴일 비교", href: "/compare?c=PT,ES,FR&y=2026" },
      ],
    },    ja: {
      heading: "ポルトガル2026年の祝日：キリスト祭とペテイイラ",
      text: "ポルトガルは2026年に11個の全国祝日があります。特に5月1日労働節、7月10日ポルトガルの日（国慶日）、8月15日聖母被昇天日、10月5日共和制宣言記念日、11月1日諸聖人の日、12月8日無原罪の聖母マリアの日は独特です。6月10日のカモンêsの日（ポルトガルの国歌詩人）も重要な文化的祝日です。",
      links: [
        { label: "ポルトガル2026年祝日", href: "/ja/PT/2026" },
        { label: "スペイン祝日", href: "/ja/ES/2026" },
        { label: "ヨーロッパ祝日比較", href: "/compare?c=PT,ES,FR&y=2026" },
      ],
    },

  },
  SE: {
    ko: {
      heading: "스웨덴 2026년 공휴일: 미드섬머와 국립 기념일",
      text: "스웨덴의 2026년 공휴일은 11개입니다. 다른 북유럽 국가와 달리 스웨덴은 미드섬머(Midsommardagen, 6월 26-27일 주말)가 가장 중요한 축제로, 크리스마스보다 더 크게celebrate합니다. 6월 6일은 국립 기념일(1974년부터 법정휴일)이며, 11월 1일은 모든 성인 날입니다. 스웨덴은 공휴일이 주말에 떨어지면 대체휴일이 없으니 주의하세요.",
      links: [
        { label: "스웨덴 2026 공휴일", href: "/ko/SE/2026" },
        { label: "노르웨이 공휴일", href: "/ko/NO/2026" },
        { label: "덴마크 공휴일", href: "/ko/DK/2026" },
      ],
    },
  },
  NL: {
    ko: {
      heading: "네덜란드 2026년 공휴일: 국왕절과 해방기념일",
      text: "네덜란드는 2026년에 9개의 전국 공휴일을 가집니다. 가장 독특한 것은 4월 27일 국왕절(Koninginnedag)로, 전국이 오렌지 색으로 뒤덮이고 거리 축제가 열립니다. 5월 5일 해방기념일(Liberation Day)은 2년마다 법정휴일입니다(2026년은 법정휴일 아님). 6월 30일 왕의 날은 왕의 생일을 기념합니다. 네덜란드 공휴일은 대부분 개신교 전통과 얽혀 있습니다.",
      links: [
        { label: "네덜란드 2026 공휴일", href: "/ko/NL/2026" },
        { label: "벨기에 공휴일", href: "/ko/BE/2026" },
        { label: "유럽 공휴일 비교", href: "/compare?c=NL,BE,DE&y=2026" },
      ],
    },
  },
  AR: {
    ko: {
      heading: "아르헨티나 2026년 공휴일: 카니발과 독립기념일",
      text: "아르헨티나의 2026년 공휴일은 12개입니다. 가장 유명한 것은 카니발 월요일과 화요일(2월 16-17일)으로, 마르델플라타와 부에노스아이레스에서 거대한 축제가 열립니다. 3월 24일 국가 추모의 날(독재 시대 기억)과 4월 2일 포클랜드 전쟁 기념일은 아르헨티나만의 특별한 holiday입니다. 5월 1일 노동절, 5월 25일 5월 혁기념일, 7월 9일 독립기념일도 중요합니다.",
      links: [
        { label: "아르헨티나 2026 공휴일", href: "/ko/AR/2026" },
        { label: "콜롬비아 공휴일", href: "/ko/CO/2026" },
        { label: "브라질 카니발 가이드", href: "/blog/global-public-holidays-2027-complete-calendar" },
      ],
    },    ja: {
      heading: "アルゼンチン2026年の祝日：カーニバルと独立記念日",
      text: "アルゼンチンの2026年の祝日は12日間です。最も有名なのはカーニバル月曜日と火曜日（2月16-17日）で、マール・デル・プラタとブエノスアイレスで巨大な祭りが開催されます。3月24日の全国追憶の日（独裁時代記憶）と4月2日のフォークランド戦記念日はアルゼンチンだけの特別な祝日です。5月1日の労働節、5月25日の5月革命記念日、7月9日の独立記念日も重要です。",
      links: [
        { label: "アルゼンチン2026年祝日", href: "/ja/AR/2026" },
        { label: "コロンビア祝日", href: "/ja/CO/2026" },
        { label: "ラテンアメリカ祝日比較", href: "/compare?c=AR,CO,BR&y=2026" },
      ],
    },

  },
  MA: {
    ko: {
      heading: "모로코 2026년 공휴일: 이슬람 절일과 독립기념일",
      text: "모로코는 2026년에 10개의 공휴일을 가집니다. 이슬람 달인 히브리력의 영향을 받아eid 알피트르(금식종료 기념, 약 2월 18-19일 예상)와 eid 알아드하(희생제판, 약 6월 27-28일 예상) 날짜가 매년 다릅니다. 7월 30일 독립기념일, 8월 14일 광복기념일, 8월 21일 왕위계승기념일은 모로코만의 national holiday입니다. 이슬람 공휴일은 기러기 모양으로 이동하니 정확한 날짜는local authority를 확인하세요.",
      links: [
        { label: "모로코 2026 공휴일", href: "/ko/MA/2026" },
        { label: "덴마크 공휴일", href: "/ko/DK/2026" },
        { label: "아프리카 공휴일 비교", href: "/compare?c=MA,SN,DZ&y=2026" },
      ],
    },    ja: {
      heading: "モロッコ2026年の祝日：イスラム祭りと独立記念日",
      text: "モロッコは2026年に10個の祝日があります。人口の95%がムスリムなので、イスラム祭日が大半を占めます。イード・アル＝フィトル（断食終了記念、約2月18-19日予測）、イード・アル＝アドハー（犠牲祭、約6月27-28日予測）、イグラ（生誕記念日）が主要な祝日です。7月30日の独立記念日、8月14日の解放記念日、8月21日の王位継承記念日はモロッコだけの祝日です。",
      links: [
        { label: "モロッコ2026年祝日", href: "/ja/MA/2026" },
        { label: "デンマーク祝日", href: "/ja/DK/2026" },
        { label: "アフリカ祝日比較", href: "/compare?c=MA,SN,DZ&y=2026" },
      ],
    },

  },
  DK: {
    ko: {
      heading: "덴마크 2026년 공휴일: 크리스텐 전통의 달력",
      text: "덴마크는 2026년에 10개의 공휴일을 가집니다. 5월 5일은 성령강림절 다음 날(Stores Bededag)로, 덴마크만의 unique holiday입니다. 6월 5일은 헌법기념일(Constitution Day)로 국왕이 연설합니다. 12월 25-26일은 크리스마스 다음 날(Danksdag)로 가족과 보내는 날입니다. 덴마크 공휴일은 대부분 루터교 전통과 얽혀 있으며, 여름에는 낮이 길어 야외 축제와 잘 어울립니다.",
      links: [
        { label: "덴마크 2026 공휴일", href: "/ko/DK/2026" },
        { label: "노르웨이 공휴일", href: "/ko/NO/2026" },
        { label: "스웨덴 공휴일", href: "/ko/SE/2026" },
      ],
    },    ja: {
      heading: "デンマーク2026年の祝日：キリスト教伝統のカレンダー",
      text: "デンマークは2026年に10個の祝日があります。5月5日は聖霊降臨祭翌日（Stores Bededag）で、デンマークだけの独自の祝日です。6月5日は憲法記念日（Constitution Day）で国王が演説します。12月25-26日はクリスマス翌日（Danksdag）で家族と過ごす日です。デンマークの祝日はほとんどルター教伝統と結びついており、夏は昼が長いて户外パーティーとよく合います。",
      links: [
        { label: "デンマーク2026年祝日", href: "/ja/DK/2026" },
        { label: "ノルウェー祝日", href: "/ja/NO/2026" },
        { label: "スウェーデン祝日", href: "/ja/SE/2026" },
      ],
    },

  },
  SN: {
    ko: {
      heading: "세네갈 2026년 공휴일: 이슬람과 프랑스 영향의 조화",
      text: "세네갈은 2026년에 9개의 공휴일을 가집니다. 인구의 95%가 무슬림이라 이슬람 절일이 대부분을 차지합니다. eid 알피트르(약 2월 18-19일 예상), eid 알아드하(약 6월 27-28일 예상), 이글(생일기념일)이 주요holiday입니다. 4월 4일 독립기념일, 5월 1일 노동절, 7월 1일 공화국기념일은 세네갈만의 national holiday입니다. 프랑스 식민역사의 흔적이 남아있는 공휴일도 있습니다.",
      links: [
        { label: "세네갈 2026 공휴일", href: "/ko/SN/2026" },
        { label: "모로코 공휴일", href: "/ko/MA/2026" },
        { label: "아프리카 공휴일 비교", href: "/compare?c=SN,MA,DZ&y=2026" },
      ],
    },    ja: {
      heading: "セネガル2026年の祝日：イスラムとフランス影響の調和",
      text: "セネガルは2026年に9個の祝日があります。人口の95%がムスリムなので、イスラム祭日が大部分を占めます。イード・アル＝フィトル（約2月18-19日予測）、イード・アル＝アドハー（約6月27-28日予測）、イグラ（生誕記念日）が主要な祝日です。4月4日の独立記念日、5月1日の労働節、7月1日の共和国記念日はセネガルだけの祝日です。",
      links: [
        { label: "セネガル2026年祝日", href: "/ja/SN/2026" },
        { label: "モロッコ祝日", href: "/ja/MA/2026" },
        { label: "アフリカ祝日比較", href: "/compare?c=SN,MA,DZ&y=2026" },
      ],
    },

  },

  // ---- Japanese (ja): Country feature blocks for near-win harvesting ----






};

/** Returns the country feature block for a given country and locale, or undefined. */
export function getCountryFeatureBlock(
  code: string,
  locale: string
): { heading: string; text: string; links: Array<{ label: string; href: string }> } | undefined {
  return COUNTRY_FEATURE_BLOCK[code.toUpperCase()]?.[locale];
}

export const POPULAR_COUNTRIES = COUNTRIES.filter((c) => c.popular);
