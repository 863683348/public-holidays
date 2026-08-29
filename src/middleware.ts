import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// ========================================================================
// 反爬虫保护：屏蔽 AI 训练爬虫 + 数据采集爬虫
// 搜索引擎爬虫（Googlebot/Bingbot/YandexBot/Baiduspider/Sogou/360Spider 等）
// 不在屏蔽列表，由下方 SAFE_BOT_PATTERNS 显式放行，保证 SEO 流量不受影响。
// ========================================================================

// 命中即拦截的 UA 关键词（小写匹配）
const BLOCKED_UA_PATTERNS: string[] = [
  // AI 训练 / 推理爬虫
  "gptbot",
  "oai-searchbot",
  "chatgpt-user",
  "chatgpt",
  "anthropic",
  "claudebot",
  "claude-web",
  "ccbot",
  "commoncrawl",
  "google-extended", // Google AI 训练专用（非搜索）
  "perplexitybot",
  "amazonbot",
  "bytespider",
  "petalbot",
  "applebot-extended", // Apple AI（非搜索）
  "meta-externalagent",
  "cohere-ai",
  "grokbot",
  "omgili",
  "diffbot",
  "imagesiftbot",
  "magpie-crawler",
  "kashmir",
  "f.seekbot",
  // SEO / 数据采集爬虫
  "ahrefsbot",
  "semrushbot",
  "mj12bot",
  "dotbot",
  "barkrowler",
  "dataforseobot",
  "seokicks-robot",
  "serpstatbot",
  "majestic-12",
  "blexbot",
  "screaming frog",
  "sitebulb",
  "wappalyzer",
  "python-requests",
  "go-http-client",
  "okhttp",
  "scrapy",
  "node-fetch",
  "java/",
  "python-urllib",
  // 简单 UA 采集工具（无品牌标识）
  "curl/",
  "wget/",
];

function isBlockedBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  if (!ua) return false;

  // 黑名单精确匹配：命中即拦截。
  // 搜索引擎爬虫（Googlebot/Bingbot 等）不在黑名单中，天然放行，
  // 无需额外白名单（白名单前缀反而会误伤 "applebot-extended" 这类子串）。
  return BLOCKED_UA_PATTERNS.some((p) => ua.includes(p));
}

export default function middleware(request: NextRequest) {
  // 反爬虫：命中已知爬虫 UA 直接 403（不消耗渲染资源）
  const userAgent = request.headers.get("user-agent") || "";
  if (isBlockedBot(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 正常流量 / 搜索引擎 → 交给 next-intl 处理 i18n
  return intlMiddleware(request);
}

export const config = {
  // 跳过 api、_next、静态文件与 ics 路由由具体应用处理
  // 顶层合法页面（/privacy /terms /contact）走 next-intl as-needed 重定向到默认语言 /en/...
  matcher: ["/", "/privacy", "/terms", "/contact", "/(zh|en|ja|ko|es|de|fr|pt|it|ru|ar|nl)/:path*"],
};
