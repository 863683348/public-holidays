import type { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/lib/blog-source";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

export default async function blogSitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  for (const l of routing.locales) {
    const posts = await fetchBlogPosts();
  const localePosts = posts.filter((p) => (p.locale || "en") === l);
    for (const post of localePosts) {
      urls.push({
        url: `${SITE_URL}/${l}/blog/${post.category}/${post.slug}`,
        lastModified: new Date(post.lastModified),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  return urls;
}
