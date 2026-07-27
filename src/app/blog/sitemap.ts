import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { BLOG_POSTS } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export default function blogSitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    // Blog homepage per locale
    urls.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });

    // Category pages per locale
    const categories = [...new Set(BLOG_POSTS.map((p) => p.category))];
    for (const cat of categories) {
      urls.push({
        url: `${SITE_URL}/${locale}/blog/${cat}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }

    // Individual articles per locale
    for (const post of BLOG_POSTS) {
      urls.push({
        url: `${SITE_URL}/${locale}/blog/${post.category}/${post.slug}`,
        lastModified: new Date(post.lastModified),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return urls;
}
