import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// #10 上线前安全头。CSP 白名单如下：
// - script-src: 'self' 'unsafe-inline' + GA4 + Google OAuth + Google AdSense
// - style-src: 'self' 'unsafe-inline'（next-themes + Next 运行时注入）
// - img-src: 'self' data: https:（用户头像 + GA4 + 广告素材）
// - font-src 'self' data:
// - connect-src: 数据源 + GA4 + gtag + AdSense 采集
// - frame-src: Google OAuth + AdSense 广告 iframe
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com https://pagead2.googlesyndication.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://date.nager.at https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com",
      "frame-src https://accounts.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      "object-src 'none'",
    ].join("; "),
  },
];

// #11 FOT 修复：Next.js 对动态段路由（[country]/[year]/[holiday]）在 Vercel 上
// 每次请求都重新渲染并强制 Cache-Control: max-age=0, must-revalidate，导致边缘缓存
// 完全失效、FOT/函数调用飙升（实测 95% 缓存未命中）。这里用 next.config headers()
// 直接覆盖响应头，告诉 Vercel CDN 把公开内容路由缓存 7 天（s-maxage=604800），
// stale-while-revalidate=86400 允许后台刷新。动态/用户相关路由（account/compare/
// pricing/api）用负向前瞻排除，保持 must-revalidate。
const STATIC_CACHE_CONTROL = "public, s-maxage=604800, stale-while-revalidate=86400";
// 时间敏感页（/today、首页今日模块）用短缓存：保留边缘缓存降 FOT，但避免日期陈旧（最长 1h）。
const SHORT_CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...routing.locales.map((locale) => ({
        source: `/${locale}/:path*`,
        headers: [{ key: "Content-Language", value: locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : locale === "pt" ? "pt-PT" : locale === "it" ? "it-IT" : locale === "ru" ? "ru-RU" : locale === "nl" ? "nl-NL" : "ar-SA" }],
      })),
      // Static content routes: cache at edge for 7 days to kill FOT.
      // Negative lookahead excludes user-specific / dynamic routes.
      {
        source: "/:locale/:path((?!account|compare|pricing|api|today).+)",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE_CONTROL }],
      },
      // 节假日详情页（4 段 /:locale/:country/:year/:holiday）——上一规则 `:path` 是单段，
      // 只能匹配 3 段（/en/GB/2026），4 段详情页实际仍返回 private,no-cache,no-store
      // （Next 动态页默认头，边缘零缓存 → 每区域每请求回源，FOT/函数调用持续高）。
      // 精确 4 段规则不碰 account/compare/pricing（2 段）与 /api（无 locale 前缀）。
      {
        source: "/:locale/:country/:year/:holiday",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE_CONTROL }],
      },
      // 各语言首页（单段路径 /en /zh /ja ...）——上一规则要求至少两段匹配不上，
      // 单独覆盖，避免这些静态页仍返回 max-age=0 每次回源验证。
      {
        source: "/:locale(zh|en|ja|ko|es|de|fr|pt|it|ru|ar|nl)",
        headers: [{ key: "Cache-Control", value: SHORT_CACHE_CONTROL }],
      },
      // 时间敏感页（/today 今日节假日）：短缓存避免日期陈旧
      {
        source: "/:locale/today",
        headers: [{ key: "Cache-Control", value: SHORT_CACHE_CONTROL }],
      },
      // sitemap/robots：爬虫高频访问路径，next-intl 通用规则不覆盖。
      // /sitemap.xml 实测 2.1MB + max-age=0 → 每次爬虫抓都触发 ISR 回源 + 2.1MB 数据传输
      // （爬虫每天多次抓 + 多 sitemap 路径），是 FOT 持续高的元凶之一。
      {
        source: "/:path(sitemap\\.xml|robots\\.txt)",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE_CONTROL }],
      },
      // 子目录下的 sitemap.xml（如 /holidays/sitemap.xml 实测 3.6MB）——上一规则要求
      // 整段 path 就是文件名，匹配不到 /holidays/sitemap.xml 这种带目录前缀的。单独列。
      {
        source: "/blog/sitemap.xml",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE_CONTROL }],
      },
      {
        source: "/holidays/sitemap.xml",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE_CONTROL }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
