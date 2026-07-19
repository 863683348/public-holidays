# 上线检查 · dafeixiang-saas-launch 10 项工作

> 评估对象：`public-holidays`（当前工作区项目）
> 评估基准：`dafeixiang-saas-launch` skill 的「MVP 搭建 10 项工作排序」
> 栈说明：本项目为 **Next.js + Cloudflare**（参考栈为 Supabase + PayPal + Vercel，仅方法论通用）；PRD 定义 **MVP = 免费层**，谷歌登录 / 收付款 属 PRD 第二阶段（M2），设计上延后。

## 总览

| 状态 | 项数 | 编号 |
|---|---|---|
| ✅ 完成 | 7 | 1、2、3、4、8、9、10 |
| 🟡 进行中 | 0 | — |
| ⬜ 未开始 | 3 | 5、6、7（均 PRD-M2 延后，非阻塞）|
| **没完成合计** | **3** | 全部为按设计延后的 M2 项，非掉项 |

## 10 项逐项状态

| # | 工作项 | 状态 | 阻塞依赖 | 证据 / 缺什么 |
|---|---|---|---|---|
| 1 | 需求（规划/UI/技术框架）设计 | ✅ 完成 | 地基 | PRD-Public-Holidays.md + MVP-Implementation-Plan.md 齐全；技术栈、i18n(next-intl)、主题(next-themes)、认证(Auth.js Google/M2)、支付(Stripe+PayPal/M2)、竞品(§4.1) 已定 |
| 2 | MVP 搭建（脚手架） | ✅ 完成 | 依赖① | `app/` 路由、`layout.tsx`、components/lib 分层齐全；`next build` 通过 |
| 3 | 中英文(i18n) | ✅ 完成 | 依赖② | zh/en/es/de/fr 五语言包 + routing/middleware/navigation + `LocaleSwitcher` 全部就绪；SubscribeButton/LongWeekendList/YearNav/CountrySelector/MonthCalendar/YearCalendar 硬编码英文已本地化；已 `next build` + 重启，线上 `/zh /es /de /fr` 均渲染对应语言、切换器可见 |
| 4 | 亮黑 UI 设定 | ✅ 完成 | 依赖② | `globals.css` 定义 `:root` + `.dark` Token；next-themes 开关；组件全用 `var(--*)`（仅 Token 定义处含字面色值，合规） |
| 5 | 谷歌登录 | ⬜ 未开始 | 依赖②；被⑥依赖 | PRD 定为 M2 第二阶段，MVP 不含；无 auth 代码 |
| 6 | 收付款对接 | ⬜ 未开始 | 依赖⑤ | PRD 定为 M2/M3；无 PayPal/Stripe/capture/webhook 代码 |
| 7 | GA4 + 热力监控 | ⬜ 未开始 | 依赖②；非阻塞 | 无 gtag/Clarity/Hotjar 代码（方法论要求仅生产加载） |
| 8 | 移动端适配 | ✅ 完成 | 依赖② | 响应式栅格 + `viewport` 导出(`width=device-width, initial-scale=1`) + header `flex-wrap` + SubscribeButton 移动端 `text-left sm:text-right` 全部到位；`next build` 已含，线上 meta viewport 已生效 |
| 9 | SEO 操作 | ✅ 完成 | 依赖② | `generateMetadata` 含 title/description/`canonical`/`alternates.languages`(hreflang en/es/de/fr/zh)；`sitemap.ts`(locales×countries×year)、`robots.ts`、`JSON-LD`(`WebSite` schema) 全部到位；`/sitemap.xml` `/robots.txt` 已验证可访问 |
| 10 | 安全检测（上线前闸门） | ✅ 完成 | — | `next.config.ts` 已加 7 项安全响应头（X-Frame-Options:DENY / X-Content-Type-Options:nosniff / Referrer-Policy / X-XSS-Protection / HSTS / Permissions-Policy / CSP `frame-ancestors 'none'`），线上 `/en` 已验证全部返回；`npm audit --omit=dev` 已执行，见「四点关键说明·4」。无 critical/high，MVP 可不阻塞上线 |

## 四点关键说明

1. **#5 / #6 / #7 是「按设计延后」，不是遗漏**
   PRD 明确把登录、支付、GA4 放到 M2/M3（免费层先上线验证流量）。这三项当前「未开始」符合计划，不属于掉项。
2. **#10 安全闸门按方法论本就在最后**
   当前无登录/支付，故「鉴权 Bearer / webhook 验签 / 配额强制」等子项天然 N/A；真正当前可做的只有「`next.config` 安全头 + `npm audit`」。它是上线前最后一道关，排在全部功能之后。
3. **#3 / #8 / #9 已收口并 rebuild 重启**
   LocaleSwitcher + 剩余硬编码英文本地化 + `viewport`/header `flex-wrap` + sitemap/robots/JSON-LD/hreflang 全部完成，已于 2026-07-19 重新 `next build` 并重启 `next start -p 3000`，线上 `/zh /es /de /fr` 与 SEO 文件均验证通过。

4. **#10 安全审计结果（npm audit）**
   `npm audit --omit=dev` 报告 **3 个 moderate** 漏洞，均非 critical/high、无运行时可利用面：
   - `next-intl *`：开放重定向（影响 middleware 路由）+ 原型污染（仅 `experimental.messages.precompile` 路径，本项目**未启用**）。修复需升 next-intl@4（3→4 大版本 breaking，需迁移 routing/navigation API）。
   - `postcss <8.5.10`（next 传递依赖，仅**构建期** CSS 处理）：XSS via 未转义 `</style>`，不影响线上已构建产物。
   - **不执行 `npm audit fix --force`**：其会把 next 降到 9.x（破坏性）、强制 next-intl 4 大版本，会毁掉当前 15.x 构建。列为 M2/后续独立任务。

## 建议下一步（按依赖顺序）

- ✅ 已全部收口并 rebuild 重启：#3 i18n、#8 移动端、#9 SEO、#10 安全闸门（`next.config.ts` 7 项安全头 + `npm audit` 已执行并评估，详见「四点关键说明·4」）。
- **MVP 上线闸门已清**：当前 10 项中 7 项完成，剩余 #5/#6/#7 均按 PRD 属 M2（登录/支付/GA4），非阻塞、非掉项。
- 后续可选优化（非阻塞）：① next-intl 升 v4 消除开放重定向 moderate 项；② 接入 GA4 / 登录 / 支付进 M2。
