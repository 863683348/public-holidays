/**
 * 外部博客数据源（方案 B：同域 ISR，博客数据不进主 repo 的 build）。
 *
 * 背景：原先博客数据编译进 src/lib/blog-posts.ts，100 天 SEO 每天加 1 篇帖会触发
 * 全量 redeploy，把 2,208 个预渲染节假日页的 CDN 缓存全部打冷 → FOT 飙升（实测 30GB/月）。
 * 现把数据迁到独立公开 data repo（raw.githubusercontent.com/863683348/public-holidays-blog-data），
 * 本模块运行时 fetch + ISR（revalidate 60s 兜底 + revalidateTag('blog-posts') 主动清），
 * 博客更新不再 redeploy 主站，主站缓存永远温暖。
 *
 * 查询函数签名与原 blog-posts.ts 保持一致（locale 可选），但全部改为 async 以适配运行时 fetch。
 */
import type { BlogPost } from "./types";

export const BLOG_DATA_TAG = "blog-posts";

const DEFAULT_URL =
  "https://raw.githubusercontent.com/863683348/public-holidays-blog-data/main/blog-posts.json";

function blogDataUrl(): string {
  return process.env.BLOG_DATA_URL || DEFAULT_URL;
}

/**
 * 带 ISR 的 fetch：
 * - next.revalidate=60：最多 60s 后台自动重拉，新帖最长 60s 内生效（无需 revalidate API 也可）。
 * - next.tags=['blog-posts']：允许 /api/revalidate 用 revalidateTag 主动清缓存即时生效。
 * fetch 失败时返回空数组（不阻断页面渲染，最坏情况博客区为空）。
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(blogDataUrl(), {
      next: { tags: [BLOG_DATA_TAG], revalidate: 60 },
    });
    if (!res.ok) throw new Error("blog data HTTP " + res.status);
    const data = (await res.json()) as BlogPost[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getAllPosts(locale?: string): Promise<BlogPost[]> {
  const posts = await fetchBlogPosts();
  const filtered = locale
    ? posts.filter((p) => (p.locale || "en") === locale)
    : posts;
  return [...filtered].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );
}

export async function getCategories(locale?: string): Promise<string[]> {
  const posts = locale ? await getAllPosts(locale) : await fetchBlogPosts();
  return [...new Set(posts.map((p) => p.category))];
}

export async function getPostsByCategory(
  category: string,
  locale?: string,
): Promise<BlogPost[]> {
  const posts = await fetchBlogPosts();
  return posts.filter((p) => {
    const matchCategory = p.category === category;
    const matchLocale = locale ? (p.locale || "en") === locale : true;
    return matchCategory && matchLocale;
  });
}

export async function getPostData(
  slug: string,
  locale?: string,
): Promise<BlogPost | undefined> {
  const posts = await fetchBlogPosts();
  if (locale) {
    const post = posts.find(
      (p) => p.slug === slug && (p.locale || "en") === locale,
    );
    if (post) return post;
  }
  // Fallback: return the "en" version of this slug
  return posts.find((p) => p.slug === slug && (p.locale || "en") === "en");
}

export async function getPostsByCountry(
  countryCode: string,
  locale?: string,
): Promise<BlogPost[]> {
  const posts = await fetchBlogPosts();
  return posts.filter((p) => {
    const matchCountry = p.relatedCountries.includes(countryCode);
    const matchLocale = locale ? (p.locale || "en") === locale : true;
    return matchCountry && matchLocale;
  });
}
