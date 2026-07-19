import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { COUNTRIES } from "@/lib/countries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pubholiday.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const year = new Date().getFullYear();

  for (const l of routing.locales) {
    urls.push({ url: `${SITE_URL}/${l}` });
    for (const c of COUNTRIES) {
      urls.push({ url: `${SITE_URL}/${l}/${c.code}` });
      urls.push({ url: `${SITE_URL}/${l}/${c.code}/${year}` });
    }
  }

  return urls;
}
