import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { COUNTRIES, NO_DATA_COUNTRIES } from "@/lib/countries";
import { BLOG_POSTS } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const year = new Date().getFullYear();
  // Past 1 year through next 5 years — keeps the sitemap focused on
  // discoverable, near-term long-tail while YearNav allows 2000–2035 on demand.
  const years = Array.from({ length: 7 }, (_, i) => year - 1 + i);

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

    // Static informational & legal pages (added 2026-08-03)
    const staticPages: {
      path: string;
      priority: number;
      freq: "monthly" | "yearly";
    }[] = [
      { path: "countries", priority: 0.7, freq: "monthly" },
      { path: "pricing", priority: 0.7, freq: "monthly" },
      { path: "for-teams", priority: 0.6, freq: "monthly" },
      { path: "privacy", priority: 0.5, freq: "monthly" },
      { path: "terms", priority: 0.5, freq: "monthly" },
      { path: "faq", priority: 0.4, freq: "monthly" },
      { path: "contact", priority: 0.4, freq: "monthly" },
      { path: "link-to-us", priority: 0.3, freq: "yearly" },
    ];
    for (const sp of staticPages) {
      urls.push({
        url: `${SITE_URL}/${l}/${sp.path}`,
        lastModified: new Date(),
        changeFrequency: sp.freq,
        priority: sp.priority,
      });
    }

    // Exclude countries the upstream has no data for — their pages are noindex.
    const listedCountries = COUNTRIES.filter(
      (c) => !NO_DATA_COUNTRIES.has(c.code.toUpperCase())
    );
    for (const c of listedCountries) {
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

    // Blog articles (bilingual posts share a slug; category from post data)
    const localePosts = BLOG_POSTS.filter((p) => (p.locale || "en") === l);
    for (const post of localePosts) {
      urls.push({
        url: `${SITE_URL}/${l}/blog/${post.category}/${post.slug}`,
        lastModified: new Date(post.lastModified),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return urls;
}
