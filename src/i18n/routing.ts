import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en", "ja", "es", "de", "fr", "pt", "it"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
