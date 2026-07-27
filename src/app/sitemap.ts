import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { COUNTRIES } from "@/lib/countries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const year = new Date().getFullYear();
  const years = [year - 1, year, year + 1, year + 2];

  for (const l of routing.locales) {
    // Homepage (highest priority)
    urls.push({
      url: `${SITE_URL}/${l}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    });

    // World clock utility page
    urls.push({
      url: `${SITE_URL}/${l}/world-clock`,
      changeFrequency: "weekly",
      priority: 0.4,
    });

    for (const c of COUNTRIES) {
      // Country landing (current year)
      urls.push({
        url: `${SITE_URL}/${l}/${c.code}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.8,
      });

      // Country + year (historical through future)
      for (const y of years) {
        urls.push({
          url: `${SITE_URL}/${l}/${c.code}/${y}`,
          lastModified: new Date(`${y}-01-01`),
          changeFrequency: "yearly",
          priority: y === year ? 0.8 : 0.6,
        });
      }
    }
  }

  return urls;
}
