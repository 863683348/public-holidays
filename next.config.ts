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
