import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// #10 上线前安全头。MVP 无登录/支付，无用户注入点。CSP 白名单如下：
// - script-src 'self' 'unsafe-inline' + Google Tag Manager（GA4）+ Google OAuth 域
// - style-src 'self' 'unsafe-inline'（next-themes + Next 运行时注入）
// - img-src 'self' data: https:（含 Google 用户头像 + GA4 像素）
// - font-src 'self' data:（含 inline SVG 图标）
// - connect-src 'self' + Nager.Date 数据源 + GA4 采集端点
// - frame-src https://accounts.google.com（NextAuth 登录弹窗）
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
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://date.nager.at https://www.google-analytics.com https://www.googletagmanager.com",
      "frame-src https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...routing.locales.map((locale) => ({
        source: `/${locale}/:path*`,
        headers: [{ key: "Content-Language", value: locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : locale === "pt" ? "pt-PT" : locale === "it" ? "it-IT" : locale === "ru" ? "ru-RU" : "ar-SA" }],
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
