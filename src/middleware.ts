import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 跳过 api、_next、静态文件与 ics 路由由具体应用处理
  // 顶层合法页面（/privacy /terms /contact）走 next-intl as-needed 重定向到默认语言 /en/...
  matcher: ["/", "/privacy", "/terms", "/contact", "/(zh|en|ja|ko|es|de|fr|pt|it|ru|ar)/:path*"],
};
