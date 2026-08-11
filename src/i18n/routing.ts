import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en", "ja", "ko", "es", "de", "fr", "pt", "it", "ru", "ar", "nl"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
