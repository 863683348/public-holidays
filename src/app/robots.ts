import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

// AI 训练爬虫 + 数据采集爬虫（屏蔽，防止数据集被抓去训练/采集）
// 注意：搜索引擎爬虫（Googlebot/Bingbot/YandexBot/Baiduspider 等）不在屏蔽列表，
// 由下方 userAgent: "*" 规则放行，保证 SEO 流量不受影响。
const BLOCKED_BOTS = [
  // AI 训练 / 推理爬虫
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "CCBot", // Common Crawl
  "Google-Extended", // Google AI 训练（不影响 Google 搜索）
  "PerplexityBot",
  "Amazonbot",
  "Bytespider", // 字节跳动
  "PetalBot", // 华为
  "Applebot-Extended", // Apple AI（不影响 Apple 搜索）
  "Meta-ExternalAgent",
  "cohere-ai",
  "grokbot", // xAI
  "omgili", // AI 搜索聚合
  "diffbot",
  "imagesiftbot",
  "magpie-crawler",
  "kashmir",
  "f.seekbot",
  "anthropic-ai",
  // SEO / 数据采集爬虫
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "Barkrowler",
  "DataForSeoBot",
  "Seokicks-robot",
  "SerpstatBot",
  "Majestic-12",
  "BLEXBot",
  "Screaming Frog",
  "Sitebulb",
  "Wappalyzer",
  "python-requests",
  "go-http-client",
  "okhttp",
  "scrapy",
  "curl",
  "wget",
  "Java/",
  "python-urllib",
  "node-fetch",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 屏蔽 AI 训练 + 数据采集爬虫（整站禁止）
      {
        userAgent: BLOCKED_BOTS,
        disallow: "/",
      },
      // 其余（含所有搜索引擎爬虫）允许
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    host: SITE_URL,
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/holidays/sitemap.xml`,
      `${SITE_URL}/blog/sitemap.xml`,
    ],
  };
}
