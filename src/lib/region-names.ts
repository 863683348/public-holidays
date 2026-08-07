// English region (ISO-3166-2 subdivision) names for the regional partition
// table on holiday detail pages (SPEC-002 §3c). English-only by design —
// localizing 400+ region names across 11 locales is out of scope.
//
// Note: Intl.DisplayNames(["en"], { type: "region" }) is tried first because
// some runtimes accept ISO-3166-2 subdivision codes ("AU-WA" → "Western
// Australia"). Node 22 throws RangeError for those codes, so REGION_NAMES
// below carries the CLDR English short names for the subdivision codes the
// site actually renders (federal markets with regional holidays). Unknown
// codes fall back to the raw ISO code — never throw.

const REGION_NAMES: Record<string, string> = {
  // Australia
  "AU-ACT": "Australian Capital Territory",
  "AU-NSW": "New South Wales",
  "AU-NT": "Northern Territory",
  "AU-QLD": "Queensland",
  "AU-SA": "South Australia",
  "AU-TAS": "Tasmania",
  "AU-VIC": "Victoria",
  "AU-WA": "Western Australia",
  // Canada
  "CA-AB": "Alberta",
  "CA-BC": "British Columbia",
  "CA-MB": "Manitoba",
  "CA-NB": "New Brunswick",
  "CA-NL": "Newfoundland and Labrador",
  "CA-NS": "Nova Scotia",
  "CA-NT": "Northwest Territories",
  "CA-NU": "Nunavut",
  "CA-ON": "Ontario",
  "CA-PE": "Prince Edward Island",
  "CA-QC": "Quebec",
  "CA-SK": "Saskatchewan",
  "CA-YT": "Yukon",
  // United Kingdom
  "GB-ENG": "England",
  "GB-NIR": "Northern Ireland",
  "GB-SCT": "Scotland",
  "GB-WLS": "Wales",
  // Germany
  "DE-BW": "Baden-Württemberg",
  "DE-BY": "Bavaria",
  "DE-BE": "Berlin",
  "DE-BB": "Brandenburg",
  "DE-HB": "Bremen",
  "DE-HH": "Hamburg",
  "DE-HE": "Hesse",
  "DE-MV": "Mecklenburg-Vorpommern",
  "DE-NI": "Lower Saxony",
  "DE-NW": "North Rhine-Westphalia",
  "DE-RP": "Rhineland-Palatinate",
  "DE-SL": "Saarland",
  "DE-SN": "Saxony",
  "DE-ST": "Saxony-Anhalt",
  "DE-SH": "Schleswig-Holstein",
  "DE-TH": "Thuringia",
  // United States
  "US-AL": "Alabama",
  "US-AK": "Alaska",
  "US-AZ": "Arizona",
  "US-AR": "Arkansas",
  "US-CA": "California",
  "US-CO": "Colorado",
  "US-CT": "Connecticut",
  "US-DE": "Delaware",
  "US-FL": "Florida",
  "US-GA": "Georgia",
  "US-HI": "Hawaii",
  "US-ID": "Idaho",
  "US-IL": "Illinois",
  "US-IN": "Indiana",
  "US-IA": "Iowa",
  "US-KS": "Kansas",
  "US-KY": "Kentucky",
  "US-LA": "Louisiana",
  "US-ME": "Maine",
  "US-MD": "Maryland",
  "US-MA": "Massachusetts",
  "US-MI": "Michigan",
  "US-MN": "Minnesota",
  "US-MS": "Mississippi",
  "US-MO": "Missouri",
  "US-MT": "Montana",
  "US-NE": "Nebraska",
  "US-NV": "Nevada",
  "US-NH": "New Hampshire",
  "US-NJ": "New Jersey",
  "US-NM": "New Mexico",
  "US-NY": "New York",
  "US-NC": "North Carolina",
  "US-ND": "North Dakota",
  "US-OH": "Ohio",
  "US-OK": "Oklahoma",
  "US-OR": "Oregon",
  "US-PA": "Pennsylvania",
  "US-RI": "Rhode Island",
  "US-SC": "South Carolina",
  "US-SD": "South Dakota",
  "US-TN": "Tennessee",
  "US-TX": "Texas",
  "US-UT": "Utah",
  "US-VT": "Vermont",
  "US-VA": "Virginia",
  "US-WA": "Washington",
  "US-WV": "West Virginia",
  "US-WI": "Wisconsin",
  "US-WY": "Wyoming",
  "US-DC": "District of Columbia",
};

/** ISO-3166-2 "AU-WA" → "Western Australia"; falls back to the raw code. */
export function regionName(iso3166_2: string): string {
  const code = iso3166_2.trim().toUpperCase();
  if (!code) return iso3166_2;
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    if (name && name !== code) return name;
  } catch {
    // Subdivision codes unsupported in this runtime — fall through.
  }
  return REGION_NAMES[code] ?? iso3166_2;
}
