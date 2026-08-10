# ESTIMATE — Tier 2 / Tier 3 设计工作量评估（人日）

> 作者：颜好看（UI/UX Designer）｜日期：2026-08-07
> 范围：只读评估，为设计师对接用。不含业务代码/设计稿产出。
> 依据：竞品报告 `public-holidays-vs-worldholidays-2026-08-07.md` + 源码审查
> （globals.css / page.tsx / CountryHolidayView / HolidayDetailView / HolidaySiblingList /
> YearCalendar / MonthCalendar / TodayHolidays / WorldClock / YearNav / pricing /
> SubscribeButton / HolidayFaq / blog / SPEC-001 / ADR-002）

---

## 0. 现有设计系统盘点（评估基准）

| 维度 | 现状 | 对 Tier 2/3 的含义 |
|---|---|---|
| Token | 仅 5 色：`--bg/--fg/--muted/--card/--border` + Tailwind `brand`(#4f46e5)/`brand-fg` | 新增交互态需**极小扩展**（同 family），不另起炉灶 |
| 深色模式 | `.dark` class + next-themes（`globals.css` 已定义） | 所有新页面/组件必须浅深双态设计 |
| 语言 | 11 locales（含 **ar RTL**） | 文案宽度 + RTL 方向是全局风险（见 §5） |
| 图标 | lucide-react 锁定（ADR-002），禁用 emoji | 全部新组件图标从 lucide 取，尺寸 16/20/24 |
| 渐变 | 全站无渐变（SPEC-001 明确 No gradients） | 保持；禁用紫粉渐变（P0） |
| 卡片语言 | `rounded-xl border-[var(--border)] bg-[var(--card)]`，brand 作唯一强调 | Tier 2/3 沿用同一语法 |
| 已有可复用组件 | YearCalendar / MonthCalendar / TodayHolidays / WorldClock / CountrySelector / YearNav / HolidayFaq / HolidaySiblingList / LongWeekendList / SubscribeButton / AdSlot | 见各项复用率 |
| OG 图 | **无** opengraph-image 生成，blog 用静态 SVG URL | T3-③ 需新增 OG 模板设计 |
| DESIGN.md | 不存在 | 建议 Tier 2 开工前先补一页轻量 DESIGN.md（沿用现有 token 即可，不必大动） |

---

## 1. Tier 2-① `/compare` 多国并排对比仪表盘

### 设计交付物清单
- **骨架 wireframe（必先行）**：多国选择器（chips 增删）、年份切换、对比矩阵布局（2–6 国 × 12 月）、"所有国家都放假"高亮行、分享栏
- **高保真**：桌面 12 列 + 移动端水平滚动（sticky 首列）双版
- **新组件变体**：`CompareMatrix`（核心）、`CountryMultiSelect`（复用 CountrySelector 的搜索逻辑改多选）、`Chip`（选中/移除态）、`CompareLegend`（高亮图例）、`ShareBar`（复制分享 URL，复用 SubscribeButton 的 copy 模式）
- **复用现有**：YearNav 年份 chips 思路、MonthCalendar 日期网格逻辑、AdSlot、card/border token
- **复用率：约 40–50%**（矩阵 + 多选 + 高亮 + URL 状态全是新交互）

### 状态与响应式
- 状态：空（0 国 → 引导选国）→ 加载（每国独立 skeleton，单国失败不拖垮整页）→ 1 国（提示至少 2 国）→ 2–6 国正常 → 错误（上游失败，复用 `country.dataLag` 文案）
- 响应式：桌面并排矩阵；移动端水平滚动 + 冻结国家名列；**"全部放假"高亮需在图例 + 颜色 + 文字三层传达**（不只靠颜色）
- 主题：浅深双态；高亮色建议 brand 同 family 的浅底（如 `bg-brand/10`，与现有 next-holiday 卡一致）

### 设计工作量：**3.5–4.5 人日**
| 阶段 | 人日 |
|---|---|
| 概念/结构（wireframe + IA + URL query 状态设计 + 交互流程） | 1.5 |
| 视觉（矩阵布局、高亮态、移动端滚动、深浅主题） | 1.0 |
| 组件规约（CompareMatrix token/尺寸/交互、MultiSelect、Chip、Legend、ShareBar） | 1.0 |
| 交付前端规格（状态矩阵、响应式、copy keys × 11） | 0.5–1.0 |

### 依赖
- **交互骨架必须先行于一切开发**：多选交互 + URL query 协议（`?c=US,GB,DE&y=2026`）+ 矩阵布局是硬前置，任何一处晚定都返工
- 可并行：B2B 页设计（互为链接资产，见 §4）

---

## 2. Tier 2-② 问题式标题 / FAQ 吃 PAA 的整站文案与 FAQ 交互

### 设计交付物清单
- **文案规约（copy spec）**：哪些页面改问题式 H1/Title（单节日页已做、国家年页补 `when is the next …`），保留现有描述式 Title 不动；每类页面的问题句式清单（× 11 语言）
- **统一 FAQ 手风琴组件**：`FaqAccordion`（替换 HolidayFaq 的纯列表 + CountryHolidayView 内联 FAQ；`aria-expanded`/`aria-controls`、键盘可达、Chevron 图标、focus-visible ring）
- **视觉**：手风琴开合态、过渡（150–200ms）、移动端无缩进塌陷
- **复用现有**：HolidayFaq 的 items 数据结构（question/answer 共享 JSON-LD 的机制保留）、lucide ChevronDown、border-b 分隔
- **复用率：约 60%**（数据结构与页面已就位，主要是统一组件 + 文案）

### 状态与响应式
- 状态：默认折叠 / 展开一项 / 全展开（aria）；空（无 FAQ 项 → 不渲染，现状已如此）
- 响应式：手风琴全宽无侧边栏；移动端按钮命中区 ≥44px
- 主题：浅深双态（沿用 border/muted token）

### 设计工作量：**1.5–2.5 人日**
| 阶段 | 人日 |
|---|---|
| 概念/结构（问题式句式清单、PAA 覆盖矩阵、哪些页改哪些保留） | 0.5 |
| 视觉（手风琴组件、开合/焦点/过渡） | 0.5 |
| 组件规约（FaqAccordion token/尺寸/交互） | 0.5 |
| 交付前端规格（copy keys + 每页 FAQ 种子问题 × 11） | 0.5–1.0 |

### 依赖
- FaqAccordion 组件规约先定，前端才能统一替换现有两处 FAQ（CountryHolidayView + HolidayDetailView）
- 文案可并行写，但 H1 句式改动需与 SEO 团队（架构师）确认 canonical/Title 策略不动

---

## 3. Tier 3-① `/today` 实时页

### 设计交付物清单
- **骨架 wireframe**：今日全球假期主列表 + 区域分组 + 日期切换（今日/明日/昨日）+ "接下来 7 天"侧栏
- **高保真**：列表 + 世界时钟组合版式
- **新组件变体**：`DateSwitcher`（小，复用 YearNav 的 prev/next 模式）、`RegionGroup`（区域分组头）、`TodayPageShell`
- **复用现有（高）**：**TodayHolidays 约 90% 直接复用**（当前是首页组件，抽成可传完整国家列表的独立用法）、**WorldClock 约 90%**、CountrySelector、AdSlot
- **复用率：约 70–80%**（核心是页面组合 + 少量新组件）

### 状态与响应式
- 状态：加载（时钟已自带）、空（今天无国放假 → 引导去 /compare 或选年份）、单国失败（沿用 noData 文案）
- 响应式：移动端单列列表；桌面双栏（假期列表 + 时钟/next-7-days 侧栏）
- 主题：浅深双态

### 设计工作量：**1.5–2.5 人日**
| 阶段 | 人日 |
|---|---|
| 概念/结构（页面 IA、日期切换、区域分组、与首页 TodayHolidays 的关系） | 0.5 |
| 视觉（列表版式、区域分组、侧栏、双栏响应式） | 0.5–1.0 |
| 组件规约（TodayPageShell / DateSwitcher / RegionGroup） | 0.5 |
| 交付前端规格（状态、copy keys × 11） | 0.5 |

### 依赖
- 依赖 TodayHolidays 是否抽成可配置 props 的组件——需与前端确认接口，属轻量改动
- 可与 T2-① 并行设计（两者都碰 CountrySelector/日期导航，注意共用组件规约一致）

---

## 4. Tier 3-② 团队 / B2B 叙事页（品牌页）

### 设计交付物清单
- **叙事大纲（copy-first）**：对标竞品"为什么团队选择"，但**不抄套路**——差异化卖点：11 语言、官方源 E-E-A-T、compare 可分享资产、ICS/Pro 订阅、世界时钟；场景：跨境排期/HR/供应链
- **高保真**：非对称 hero（禁止千篇一律居中 hero）、问题-方案节、UseCase 卡、CTA 到 /compare + /pricing#pro、信任区（官方来源，**不放虚构数字**——P0 反 AI 模板）
- **新组件变体**：`B2BHero`、`UseCaseCard`、`StatStrip`（真实数据才用）、`CtaBand`
- **复用**：card/border token、SubscribeButton 模式、Footer；与 pricing 的 Pro 卡呼应
- **复用率：约 20–30%**（这是 Brand 寄存器页面，视觉基本全新；token 复用）

### 状态与响应式
- 状态：营销页以静态为主；CTA 按钮需 hover/focus/active/loading（订阅跳转复用现有逻辑）
- 响应式：hero 桌面左文右图 / 移动堆叠；UseCase 卡 3→1 列
- 主题：浅深双态（**11 语言叙事文案是最大成本，不是视觉**）

### 设计工作量：**3–4 人日**
| 阶段 | 人日 |
|---|---|
| 概念/结构（叙事大纲、11 语言文案框架、与 pricing 的 IA 分界） | 1.0 |
| 视觉（hero、UseCase、CtaBand、深浅双态） | 1.5 |
| 组件规约（新营销组件） | 0.5 |
| 交付前端规格（copy × 11、链接地图、状态） | 0.5–1.0 |

### 依赖
- **先定 IA**：B2B 页 = 叙事入口，pricing = 转化页，/compare = 资产；三页关系必须先定，否则重复建设
- 上线依赖 /compare 已存在（作为主 CTA 资产）；但设计可与 T2-① 并行

---

## 5. Tier 3-③ 长周末深度指南博客（内容页模板 + OG 图 + 目录/内链组件）

### 设计交付物清单
- **文章模板 wireframe**：标题区（含问题式 H1）、目录侧栏、长周末数据块、相关文章、内链
- **高保真**：文章页双栏（TOC + 正文）+ 移动端 TOC 折叠
- **新组件变体**：`ArticleToc`（目录 + 锚点 + scrollspy 高亮）、`LongWeekendDataBlock`（复用 LongWeekendList 逻辑做富展示）、`RelatedPosts`（已有国家页同款网格，提为通用组件）
- **OG 图模板（新资产）**：1200×630，品牌底 + 节日/长周末信息，**文本规则**（见风险）
- **复用**：blog 页壳、LongWeekendList、related-blog 网格模式、AdSlot、breadcrumb/FAQPage JSON-LD helper
- **复用率：约 50%**

### 状态与响应式
- 状态：文章加载（SSR 无需）、TOC 空（短文无目录 → 隐藏）、长周末数据空（无 → 隐藏块）、OG 图生成失败（fallback 品牌底图）
- 响应式：桌面双栏 TOC 固定；移动端 TOC 顶部折叠手风琴
- 主题：浅深双态（文章正文用既有 prose 风格）

### 设计工作量：**2–3 人日**
| 阶段 | 人日 |
|---|---|
| 概念/结构（模板 section 顺序、TOC/内链 schema） | 0.5 |
| 视觉（文章版式、TOC、数据块、OG 模板） | 1.0 |
| 组件规约（ArticleToc / LongWeekendDataBlock / RelatedPosts + OG 模板规格） | 0.5–1.0 |
| 交付前端规格（OG 每语言文本规则、copy keys × 11） | 0.5 |

### 依赖
- **OG 模板必须先行**（前端要用 `next/og` 生成）；OG 文本规则（哪些字段翻译/哪些用英文）先定
- 内容（文章本身）由内容侧并行，不占设计人日

---

## 6. 合计

| 项 | 人日 range |
|---|---|
| T2-① /compare | 3.5–4.5 |
| T2-② FAQ/PAA | 1.5–2.5 |
| **Tier 2 合计** | **5.0–7.0** |
| T3-① /today | 1.5–2.5 |
| T3-② B2B 叙事页 | 3.0–4.0 |
| T3-③ 长周末博客 | 2.0–3.0 |
| **Tier 3 合计** | **6.5–9.5** |
| **总合计** | **11.5–16.5** |

> 注：不含 11 语言文案翻译成本本身（文案由内容侧出，设计只出句式/keys 规约）；不含 QA。

---

## 7. 设计先行项清单（必须先于对应开发）

1. **/compare 交互骨架**（多选 + URL query 协议 + 矩阵布局）——最高优先级，晚定必返工
2. **FaqAccordion 组件规约**——统一现有两处 FAQ，前端替换需要它
3. **OG 图模板 + 文本规则**——T3-③ 前端 `next/og` 的前置
4. **B2B 页 IA 决策**（B2B/pricing/compare 三页关系）——先定再画
5. **/today 页面组合 spec**——轻量，可与 T2-① 并行，但 DateSwitcher/分组需先固定
6. **（建议）一页轻量 DESIGN.md**——沿用现有 5 色 token，补齐交互态 token（--focus-ring/高亮色），Tier 2 开工前 0.5 人日

---

## 8. 风险清单

| 风险 | 说明 | 对策 |
|---|---|---|
| **11 语言文案宽度冲击布局** | 德/俄/日文问题式 H1 可达英文 2–3 倍宽；矩阵表头、chips、按钮溢出；**ar RTL 翻转矩阵方向** | 所有新组件规约带 min-width/truncate/ellipsis；每语言视觉走查清单；RTL 单独过一遍；文案 keys × 11 的成本勿低估（每个新 namespace ≈ 40–60 keys） |
| **OG 图多语言** | 图内放多语言文本不可行（易截断/不可维护） | OG 模板用品牌视觉 + 数字/日期为主，文案用英文或按语言生成**短文案**；compare 类数据快照防缓存过期 |
| **B2B 页与 pricing 重复** | 定位不清会做成第二个 pricing | 先定 IA：B2B=叙事，pricing=转化，compare=资产；B2B 的 Pro CTA 一律指向 pricing#pro |
| **/compare 移动端矩阵** | 2–6 国 × 12 月全矩阵在手机上是最大 UX 风险 | 水平滚动 + sticky 首列 + 简化视图（默认只看"同日假期"行，非全日历）；高亮三层传达（图例+颜色+文字） |
| **Token 缺口** | 现有仅 5 色，compare 高亮/FAQ 交互态/B2B 品牌元素缺 token | 在同一 family 内极小扩展（--highlight / --focus-ring / --surface-2），**不另起炉灶**、不引入新色相 |
| **P0 红线** | emoji 图标 / 紫粉渐变 / AI 模板味（千篇一律 hero、虚构数字） | 全程 lucide-react；无渐变；B2B hero 非对称 + 真实卖点 + 不放虚构指标 |

---

## 9. 结论

- Tier 2（5–7 人日）里 **/compare 是设计与开发都最重的项**，且它的交互骨架是全局最早的前置，建议排第一个。
- Tier 3（6.5–9.5 人日）里 **B2B 页最贵**（Brand 寄存器 + 11 语言叙事），但可与 Tier 2 并行设计。
- 整体风险集中在**语言层（文案宽度 × RTL）与 /compare 移动端**，这两处要在组件规约里提前封死，而不是靠前端临场调。
- 设计系统无需重建：现有 5 色 token + lucide + card 语言足够支撑全部 Tier 2/3，只做同 family 极小扩展。
