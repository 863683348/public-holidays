# Public Holidays — 项目总结报告

> **报告日期**：2026-07-25
> **项目状态**：MVP 已上线（M1 阶段完成），部署于 Vercel + 正式域名 `public-holidays.shop`

---

## 项目地址

| 项目 | 地址 |
|------|------|
| **GitHub 仓库** | [https://github.com/863683348/public-holidays](https://github.com/863683348/public-holidays) |
| **线上域名** | [https://public-holidays.shop](https://public-holidays.shop) |
| **本地开发** | `http://localhost:3000` |

---

## 技术架构（一句话概括）

> **Next.js 15 (App Router) + next-intl 多语言 + Tailwind CSS + Nager.Date API，Vercel 部署的全球公共假期查询 SPA，SSG 预渲染 5 语言首页，动态函数按需降级为 Vercel Functions。**

### 技术栈明细

| 层 | 选型 | 版本 |
|----|------|------|
| 框架 | Next.js (App Router) | ^15.1.6 |
| 语言 | TypeScript | ^5.7 |
| 多语言 | next-intl | ^3.26 |
| 主题 | next-themes | ^0.4 |
| 样式 | Tailwind CSS | ^3.4 |
| 数据源 | Nager.Date API (免费开源) | v3 |
| 部署 | Vercel (原生 Next.js 零配置) | — |
| 测试 | Vitest (纯函数单测) | ^2.1 |
| 缓存 | 文件系统缓存 (Node fs) + Fetch revalidate (90天) | — |

### 部署拓扑

```
用户 → Cloudflare CDN (域名) → Vercel Edge → Next.js Runtime
                                        ├─ SSG: /[locale] (5语言首页/世界时钟)
                                        ├─ SSG: /robots.txt / sitemap.xml
                                        ├─ Dynamic: /[locale]/[country] (函数按需执行)
                                        ├─ Dynamic: /[locale]/[country]/[year]
                                        └─ Dynamic: /[locale]/api/holidays / calendar.ics
```

---

## 项目概述

### 一句话目标

> **"Know the holidays. Beat the calendar."——让跨境团队和全球工作者一键查遍各国公共假期、规划长周末、同步日历，告别"国际时差式假期误判"。**

### 核心目标

#### 目标一：多国假期一键查询（MVP 基石）

- 覆盖 **46 个国家/地区**，含中国(CN)、中国香港(HK)、中国台湾(TW)、美国、英国、日韩、欧洲全境、东南亚主要市场
- 年视图/月视图双模式，红色标记假期，支持年份切换
- 国家列表搜索 + 热门国家快捷入口（US/GB/CA/AU/DE/FR/ES/IT 等 19 个热门国）

#### 目标二：长周末智能规划

- 「自然长周末」自动识别：假期连上周六日→标出连续休息天数
- 「桥接长周末」智能推荐：周X假期 + 请 1 天假（bridge day）→ 拼出 4 天连休
- 每项长周末直观显示起止日期、总天数、是否需要请假、建议请假日

#### 目标三：日历订阅一键同步

- 为每个国家生成 ics 订阅链接（遵循 iCalendar RFC 5545 格式）
- 一键导入 Google Calendar / Apple Calendar / Outlook
- 数据更新自动同步到用户的日历

#### 目标四：全球多语言覆蓋

- **5 种语言**：中文(zh)、英文(en)、西班牙文(es)、德文(de)、法文(fr)
- 默认中文，用户可通过切换器自由切换
- 全 UI 本地化：首页、国家页、长周末、世界时钟、底部声明等所有文案均 i18n
- SEO hreflang：`<link rel="alternate" hreflang="zh/en/es/de/fr">` 全量覆盖

#### 目标五：世界时钟（MVP 特色增值功能）

- 实时显示 **12 个全球主要时区**的当前时间
- 自动检测用户本地时区，1 秒刷新
- 今日公共假期徽章：从 API 实时拉取对应国家当日是否有假期
- 时区城市标注（UTC 偏移量）

#### 目标六：企业级工程质量

- **7 项安全响应头**：X-Frame-Options: DENY、HSTS、CSP(frame-ancestors 'none')、X-Content-Type-Options:nosniff 等
- **SEO 全链路覆盖**：sitemap.xml (locales x 46 countries x 年份) + robots.txt + JSON-LD 结构化数据(WebSite Schema) + 多语言 canonical
- **无障碍**：focus-visible 键盘可达、暗色/亮色双主题、响应式移动端自适应
- **代码质量**：TypeScript 全类型、next-intl 国际化路由、零 emoji 图标、Design Token 样式
- **品牌一致性**：统一描边 SVG 图标、非紫粉渐变、无 AI 模板味

---

## 核心功能清单

| 功能 | 状态 | 说明 |
|------|------|------|
| 国家假期查询（年视图） | ✅ 已上线 | 46 国，红标假期，年份切换 |
| 月视图 | ✅ 已上线 | 响应式网格，移动端友好 |
| 国家搜索 | ✅ 已上线 | 实时搜索过滤，大小写不敏感 |
| 长周末计算 | ✅ 已上线 | 自然长周末 + 桥接长周末推荐 |
| iCal 日历订阅 | ✅ 已上线 | .ics 格式，同步 Google/Apple/Outlook |
| 多语言 i18n | ✅ 已上线 | zh/en/es/de/fr 五语全景 |
| 暗色/亮色主题 | ✅ 已上线 | next-themes 自动跟随系统 + 手动切换 |
| 世界时钟 | ✅ 已上线 | 12 时区、实时刷新、假期徽章 |
| SEO (sitemap/robots/JSON-LD) | ✅ 已上线 | 全量覆盖 |
| 安全响应头 | ✅ 已上线 | 7 项配置 |
| 响应式移动端 | ✅ 已上线 | flex-wrap 自适应 + viewport meta |
| 广告位占位 | ✅ 已上线 | M2 接真实广告 |
| Google 登录 (M2) | ⬜ 延后 | PRD 第二阶段 |
| AI 规划 (M2) | ⬜ 延后 | PRD 第二阶段 |
| 付费订阅 (M2) | ⬜ 延后 | PRD 第二阶段 |

---

## 关键里程碑

| 日期 | 事件 | 说明 |
|------|------|------|
| 2026-07-12 | **项目初始化** | 基于 dafeixiang-saas-launch 方法论，完成 PRD + MVP 实施计划 |
| 2026-07-17 | **首版部署** | 本地部署成功，首屏可预览 |
| 2026-07-18 | **多语言上线** | 5 语言 i18n (next-intl) 全线覆盖 |
| 2026-07-19 | **世界时钟** | 新增世界时钟页面，12 时区实时显示 |
| 2026-07-19 | **SEO + 安全** | sitemap.xml, robots.txt, JSON-LD, 7 项安全头全量完成 |
| 2026-07-20 | **Cloudflare 部署 3 次失败** | ERESOLVE / OpenNext 误判 / Worker 误判，确认方案不适用 |
| 2026-07-22 | **迁移 Vercel** | 清理全部 Cloudflare 依赖，转 Vercel 原生 Zero Config 部署成功 |
| 2026-07-22 | **配置正式域名** | `public-holidays.shop` DNS 配置完成，canonical/sitemap/robots 全指向新域名 |
| 2026-07-25 | **Logo 跳转优化** | Header 跳转首页交互改进（`<span>` → `<Link href="/">`) |

---

## 关键决策记录

| 决策 | 方案 | 替代方案 | 结论 |
|------|------|----------|------|
| 部署平台 | **Vercel** | Cloudflare Workers/Pages | Vercel Zero Config + Next.js 原生，3 轮 Cloudflare 失败后确认 |
| 多语言方案 | **next-intl** | next-i18next / 自实现 | 路由前缀式 locale，SSG 支持好，生态活跃 |
| 数据源 | **Nager.Date** | Calendarific / 自托管 | 免费、CORS 友好、120+ 国、无鉴权，MVP 最省心 |
| 数据缓存 | **Node fs + Fetch revalidate 90d** | Cloudflare KV / 自建 Redis | 离 Cloudflare 后 FS 缓存写忽略，靠 HTTP cache 层兜底 |
| 认证/支付 | **M2 延后** | Auth.js / Stripe 预接入 | 遵循 PRD 第一性原则：先免费验证流量，后变现 |
| 品牌色调 | **蓝色系 + 浅色/暗色双主题** | 紫粉渐变 (P0 禁) | 拒绝 AI 模板风，保持专业清爽 |
| 默认语言 | **中文 (zh)** | English | 用户指定，提示语全中文化 |

---

## 项目结构

```
public-holidays/
├─ package.json              # 依赖与脚本
├─ next.config.ts            # Next.js 配置 (i18n + 安全头)
├─ vercel.json               # Vercel 环境变量
├─ tailwind.config.ts        # Tailwind 配置
├─ tsconfig.json             # TypeScript 配置
├─ middleware.ts             # next-intl 语言协商中间件
├─ src/
│  ├─ i18n/                  # 国际化核心
│  │  ├─ routing.ts          # locales 定义 (zh/en/es/de/fr)
│  │  ├─ request.ts          # 服务端配置
│  │  ├─ navigation.ts       # i18n Link/redirect/router
│  │  └─ messages/           # 5 套语言包
│  ├─ lib/                   # 核心逻辑
│  │  ├─ holidays.ts         # 假期数据获取 + 缓存
│  │  ├─ longWeekend.ts      # 长周末算法
│  │  ├─ ics.ts              # iCalendar 生成器
│  │  └─ types.ts            # 类型定义
│  ├─ app/                   # Next.js App Router
│  │  ├─ [locale]/           # 带语言前缀的路由
│  │  │  ├─ layout.tsx       # Header + Footer + Provider
│  │  │  ├─ page.tsx         # 首页 (国家选择 + 世界时钟入口)
│  │  │  ├─ [country]/       # 国家页路由
│  │  │  │  ├─ page.tsx      # 当前年年视图
│  │  │  │  ├─ [year]/       # 指定年视图
│  │  │  │  └─ calendar.ics/  # 订阅文件
│  │  │  ├─ world-clock/     # 世界时钟页
│  │  │  └─ api/holidays/    # JSON 接口
│  │  ├─ sitemap.ts          # 站点地图生成
│  │  ├─ robots.ts           # 爬虫规则
│  │  └─ globals.css         # Design Token + 暗色主题
│  └─ components/            # React 组件
│     ├─ CountrySelector.tsx  # 国家搜索选择器
│     ├─ YearCalendar.tsx     # 年视图日历网格
│     ├─ MonthCalendar.tsx    # 月视图日历
│     ├─ LongWeekendList.tsx  # 长周末列表
│     ├─ SubscribeButton.tsx  # 日历订阅按钮
│     ├─ YearNav.tsx          # 年份导航器
│     ├─ LocaleSwitcher.tsx   # 语言切换器
│     ├─ ThemeToggle.tsx      # 暗色模式开关
│     ├─ WorldClock.tsx       # 世界时钟 (客户端)
│     └─ AdSlot.tsx           # 广告位
```

---

## 上线检查清单 (10 项)

| # | 项目 | 状态 |
|---|------|------|
| 1 | 需求/UI/技术框架设计 | ✅ |
| 2 | MVP 脚手架搭建 | ✅ |
| 3 | 多语言 i18n | ✅ zh/en/es/de/fr |
| 4 | 亮黑 UI & 暗色主题 | ✅ |
| 5 | Google 登录 (M2) | ⬜ 延后 |
| 6 | 收付款 (M2) | ⬜ 延后 |
| 7 | GA4 监控 (M2) | ⬜ 延后 |
| 8 | 移动端适配 | ✅ |
| 9 | SEO (sitemap/robots/JSON-LD) | ✅ |
| 10 | 安全检测 (headers + audit) | ✅ |

---

## 后续规划 (M2+)

1. **Google 登录** → 用户偏好存储（关注国家、多国看板）
2. **Pro 订阅** → Stripe/PayPal 接入，解锁 AI 功能
3. **AI 长周末规划器** → 输入年假额度 + 偏好 → 最优拼假方案
4. **AI 团队冲突检测** → 多成员日历交叉分析
5. **GA4 + 热力图** → 流量分析、转化漏斗
6. **Calendarific 数据增强** → 230+ 国、宗教/地方节日
7. **更多语言** → 日/韩/葡/意等

---

*本报告基于 dafeixiang-saas-launch MVP 方法论，从 Phase 0 需求澄清到 Phase 4 部署上线，完整走完 6 阶段 SOP。*
