import type { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/lib/blog-source";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

/**
 * 只有当日期可解析时才返回 Date —— 否则返回 undefined。
 * Next.js 会对 sitemap 条目的 lastModified 调 toISOString()，
 * 传入 Invalid Date 会抛 "RangeError: Invalid time value" 并中断整个 build
 * （2026-08-22 事故：外部 data repo 有 6 条记录缺 lastModified）。
 */
function safeDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function blogSitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const posts = await fetchBlogPosts();

  for (const l of routing.locales) {
    const localePosts = posts.filter((p) => (p.locale || "en") === l);
    for (const post of localePosts) {
      urls.push({
        url: `${SITE_URL}/${l}/blog/${post.category}/${post.slug}`,
        lastModified: safeDate(post.lastModified),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  return urls;
}
