export interface Holiday {
  date: string; // YYYY-MM-DD
  localName: string;
  name: string; // English name
  countryCode: string; // ISO 3166-1 alpha-2
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  types: string[]; // Public / Bank / School ...
  launchYear?: number | null; // present in the wire payload; year the holiday was first observed
}

// One page per unique slug. API records that share a slug (e.g. the two US
// "Good Friday" records, or the four AU "Labour Day" records) are merged into a
// single HolidayGroup. See ADR-001 §3.3.
export interface HolidayGroup {
  slug: string;
  name: string; // English, from the first record
  localName: string; // from the earliest-dated record
  dates: string[]; // ascending, de-duplicated. length >= 1
  primaryDate: string; // dates[0]
  types: string[]; // union across records, de-duplicated, order-preserving
  counties: string[] | null; // union; null if ANY record is global / null
  global: boolean; // true if ANY record is global
  fixed: boolean; // true if ALL records are fixed
  launchYear: number | null; // first non-null launchYear, else null
  records: Holiday[]; // all records, sorted by date
}

export interface Country {
  code: string; // ISO alpha-2
  name: string;
  nameZh?: string;
  popular?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishedDate: string;
  lastModified: string;
  imageUrl: string;
  excerpt: string;
  content: string;
  relatedCountries: string[];
  locale?: string; // "en" | "zh" | etc., defaults to "en"
  // Optional FAQ for rich-snippet (FAQPage) eligibility + "People Also Ask" capture.
  faq?: { question: string; answer: string }[];
}
