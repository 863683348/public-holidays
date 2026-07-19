export interface Holiday {
  date: string; // YYYY-MM-DD
  localName: string;
  name: string; // English name
  countryCode: string; // ISO 3166-1 alpha-2
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  types: string[]; // Public / Bank / School ...
}

export interface Country {
  code: string; // ISO alpha-2
  name: string;
  popular?: boolean;
}
