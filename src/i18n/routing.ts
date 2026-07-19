import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en", "es", "de", "fr"],
  defaultLocale: "zh",
});

export type Locale = (typeof routing.locales)[number];
