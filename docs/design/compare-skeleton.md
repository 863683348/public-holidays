# DESIGN — `/compare` 多国对比仪表盘 交互骨架

> 作者：颜好看（UI/UX Designer）｜日期：2026-08-07
> 状态：**设计先行项 #1（交互骨架）**——前端必须等本文件冻结 URL 协议与矩阵布局后才可开工。
> 依据：竞品对比报告 + 现有代码审查（CountrySelector / YearNav / MonthCalendar /
> SubscribeButton / SPEC-001 / ADR-002 / globals.css token）。
> P0 红线：图标一律 lucide-react（禁 emoji）｜无紫粉渐变｜复用现有 5 色 token，
> 仅补 `--focus-ring` / `--highlight` 交互态（见 §11）。

---

## 1. 目标与产品语义

- 让用户选 **2–6 国 + 1 年**，并排看「哪天哪些国放假」，**一眼扫出共同假日**。
- 强可分享、易外链：整页状态收敛进 URL，复制即分享（团队排期 / 跨境协作场景天然想发链接）。
- 复用现有数据源 `getHolidays`，**不新增数据源**。

### 页面价值排序（设计优先级按此）
1. **共同假日**（≥2 国同一天放假）——最高价值，视觉最突出
2. **全员共同假日**（所有选中国同一天）——第二突出
3. 单国假日差异——普通呈现，可扫读即可

---

## 2. 路由与 URL query 协议（**冻结项**）

```
/[locale]/compare?c=US,GB,CA,AU&y=2026
```

| 参数 | 规则 |
|---|---|
| `c` | ISO 3166-1 alpha-2，**逗号分隔**，顺序即显示顺序；1–6 个 |
| `y` | 4 位年份，范围沿用 `MIN_YEAR(2000)–MAX_YEAR(2035)`；缺省 = 当年 |
| 无 `c` | 回退默认 top4：`US,GB,CA,AU`（见 §12 待确认项） |
| 含无效码 | 静默过滤 + 顶部 toast「已忽略无法识别的国家」 |
| 超 6 个 | 截断前 6 + toast「最多同时对比 6 个国家」 |
| 仅 1 个 | 保留渲染 + 空态引导「再选 1 国以对比」 |
| 重复码 | 去重 |

> 前端约定：所有 UI 状态变更（加国/删国/换年/排序）都**同步写回 URL**（`router.replace`），
> 不做本地 state 独有——这是「可分享」的根基。浏览器前进/后退天然可用。

---

## 3. 页面骨架（自上而下）

```
┌────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home › Compare                                  │
│ H1: 多国假期对比（问题式，可两行）                            │
│ 副标题: 一句话说明「选 2–6 国看共同假日」                      │
│ ┌ ShareBar ─────────────────────────────┐                   │
│ │ [复制分享链接 Link2] [重置默认 Globe]   │                   │
│ └───────────────────────────────────────┘                   │
│ ┌ CountryMultiSelect ───────────────────┐                   │
│ │ [chips: US ×] [GB ×] [CA ×] [AU ×] [＋ 添加国家 ▾]        │
│ └───────────────────────────────────────┘                   │
│ ┌ YearSwitcher ─────────────────────────┐                   │
│ │ ← [2025] [2026] [2027] →              │                   │
│ └───────────────────────────────────────┘                   │
│ ┌ CompareLegend（图例，三层高亮）────────┐                   │
│ └───────────────────────────────────────┘                   │
│ ┌ CompareDensityStrip（12 格微缩导航）────┐                   │
│ └───────────────────────────────────────┘                   │
│ ┌ CompareMatrix ────────────────────────┐                   │
│ │ 月份分组头（有假日的月份）              │                   │
│ │   行 = 具体日期（仅至少一国放假的日期）   │                   │
│ │   列 = 选中国家                        │                   │
│ └───────────────────────────────────────┘                   │
│ AdSlot（底部，沿用）                                        │
└────────────────────────────────────────────────────────────┘
```

---

## 4. 多国选择交互（chips 多选）

**组件**：`CountryMultiSelect`（client）——复用 `CountrySelector` 的搜索/过滤逻辑改造。

### 交互
1. **已选区 = chips 行**：每个 chip = 国旗/代码 + 国家名 + `X` 移除按钮。
   - chip 样式：`rounded-full border-[var(--border)] bg-[var(--card)] pl-3 pr-2 py-1.5 text-sm`，
     移除按钮为 lucide `X`（size 14，`aria-label="移除 {country}"`）。
2. **添加**：行尾 `＋ 添加国家` 按钮（lucide `Plus`，`aria-expanded`）展开下拉搜索面板。
   - 搜索框沿用 CountrySelector 的输入过滤（按 `name` / `code` / 本地化名）。
   - 候选列表点击 = 加入 chips（**立即加入，不跳转**——区别于首页选择器）。
   - 已选中的国家在候选列表置灰/打 `Check`，不可重复选。
3. **上限 6**：达到上限后「添加」按钮禁用并显示 tooltip「最多 6 国」。
4. **排序**：桌面端支持 drag 调整顺序（可选增强，P1）；顺序写回 `c` 参数。
5. **默认**：无 `c` 参数 → top4 `US,GB,CA,AU`（待确认，§12）。

### 命中区
- chips 高 ≥44px（`py-1.5 + text-sm` 约 32px，不足时补 `min-h-[44px]` 或加大 padding）。
- 下拉候选行 `py-2.5` ≥44px。

---

## 5. 年份选择

**组件**：`YearSwitcher`——直接复用 `YearNav` 的模式（← [y-1][y][y+1][y+2] →），仅把「当前年」高亮逻辑改为 URL `y` 参数。
- 图标：`ChevronLeft` / `ChevronRight`（**RTL 下翻转**，见 §10）。
- 年份 chips 尺寸/样式与 YearNav 一致，保持全站一致。
- 写回 `?y=`。

---

## 6. 核心决策：12 个月全网格 vs 只显示有假日月份

### 推荐：**「有假日的月份」为主视图（紧凑）+ 微缩密度条导航 + 可选「显示空月份」toggle**

理由（按权重）：
1. **信息语义**：compare 的第一价值是「对比 + 找共同假日」。某月所有选中国都无假 → 该月零信息，
   整块空网格占屏但无意义。全 12 月网格 ≈ 30–40% 面积是幽灵空单元格，认知负荷高
   （工作记忆 ≤4 项规则：空单元格是噪音）。
2. **数据现实**：单国一年 8–13 个假，组合后「全员无假」的月份占比通常过半。竞品同为高亮式而非满网格。
3. **移动端成本**：12 月全网格在手机上是双轴滚动，几乎不可用；紧凑视图可直接复用为移动版。
4. **反 AI 模板味**：满网格空单元格是「千篇一律」结构，紧凑视图反而更像经过思考的工具。

### 配套机制
- **微缩密度条 `CompareDensityStrip`**：12 个小格（`Jan…Dec`），格内「有任意选中国放假」→ 高亮；
  点击滚动到对应月份块。解决「紧凑视图下用户不知道哪些月有假」的导航缺口。
- **「显示空月份」toggle**：默认关；开启后补齐无假日月份（单元格显示「无假日」占位），
  给「我要确认某月确实没假」的用户用（P1 可选）。

---

## 7. 矩阵布局（冻结项）

### 结构：行 = 具体日期，列 = 国家（**日期并集对齐**）

- **月份分组头**：仅渲染「至少一国放假的月份」（升序），组头含月份名 + 该月共同假日计数 badge。
- **行 = 该月内「至少一国放假」的具体日期**（ISO 日期升序，UTC）。
- **列 = 选中国家**（顺序 = URL `c` 顺序）。
- **单元格** = 该国当天是否放假：
  - 放假 → 假日名（本地化名优先，truncate + `title` 完整名）
  - 不放假 → `—`（`text-[var(--muted)]`）

### 为什么是「日期并集行」而非「国家列卡片」？
同一天多国放假 → **同一行内多列同时有值**，垂直方向对齐，共同假日一眼可扫。
若用「月份×国家卡片 + 条目级高亮」，同一天跨国家无法对齐，对比价值大打折扣。

### 高亮系统（三层，全在 brand family，不引入新色相）

| 级别 | 条件 | 视觉 |
|---|---|---|
| L0 单国假日 | 该日期仅 1 国放假 | 无高亮（默认单元格） |
| L1 部分共同 | 该日期 ≥2 国放假（非全部） | **行级** `--highlight` 底 + `--border` 边框，日期列加 lucide `Users` 小标 |
| L2 全员共同 | 该日期 **所有** 选中国放假 | **行级** `--highlight-strong` 底 + brand 边框，行首 `全员` badge（lucide `Check`） |

- 高亮判定基于 **ISO 日期字符串相等**（全站 UTC 约定，无时区偏移问题）。
- 图例 `CompareLegend` 三项：单国（灰）/ 部分共同（浅品牌）/ 全员共同（深品牌）——**三层传达**：
  图例 + 颜色 + 文字 badge（不只靠颜色，符合无障碍）。

### 行样式
- 行容器：`grid`，首列日期宽固定（`w-20` 桌面 / `w-16` 移动），国家列 `min-w-[120px]`。
- 单元格：`px-2 py-1.5 text-sm`，假日名 `truncate`。
- 月份组之间 `space-y-2`，组头 `sticky top-0` 可选（P1）。

---

## 8. 移动端方案（冻结项）

### 策略：响应式双视图 + 默认简化视图

**移动端（<768px）默认 = 简化视图 `CompareSummary`**：
- 只渲染**共同假日（≥2 国）**的日期行；每行 = 日期 + 国家名 chips（放假国）。
- 完全**无横向滚动**；行数少（通常 ≤15），垂直滚动友好。
- 顶部一行说明「只看共同假日，点此查看完整矩阵」→ `ViewToggle` 切到完整矩阵。

**移动端完整矩阵（用户主动切换）**：
- 水平滚动容器 + **sticky 首列（日期列）**（`inset-inline-start: 0`，逻辑属性，RTL 自动在右）。
- 国家列 `min-w-[100px]`；矩阵容器 `overflow-x-auto`。
- 视图选择写入 URL（`?view=summary|matrix`，缺省移动 summary / 桌面 matrix）。

**桌面端（≥768px）默认 = 完整矩阵**，可用 toggle 切到简化视图。

> 理由：手机用户最高价值是「哪天多国都放假」，横向扫 6 列不是主任务；
> 简化视图把最高价值信息前置，完整矩阵留给需要的人。

---

## 9. Share 条（UI 侧）

**组件**：`ShareBar`（client）——复用 `SubscribeButton` 的 clipboard 模式。

- 主按钮：`复制分享链接`（lucide `Link2`，primary 样式 `bg-brand text-brand-fg`）；
  点击 `navigator.clipboard.writeText(location.origin + pathname + search)`，成功变「已复制」
  （`Check` 图标 + 2s 后还原，复用 SubscribeButton 的 `copied` 状态机）。
- 次按钮：`重置`（lucide `RotateCcw`，ghost 样式）→ 清空回 `?c=US,GB,CA,AU&y=当前年`。
- 可选 P1：`打开分享面板`（lucide `Share2`）展示可复制的完整 URL + 「在新标签打开」。
- **外链友好**：整页 URL 即状态快照，任何人打开即见同一矩阵；`canonical` 指向无参版本
  （`/locale/compare`，避免 query 造成重复索引，由 SEO 层处理）。

---

## 10. 11 语言文案宽度 & ar RTL 策略（冻结项）

### 文案宽度
| 位置 | 策略 |
|---|---|
| H1 / 副标题 | 允许 2 行；不设 `truncate`；字号 clamp（`text-2xl→3xl`） |
| 单元格假日名 | `truncate` + `title` 完整名（德/俄/日名可达英文 2–3 倍宽） |
| 月份组头 | 允许换行；badge 与文本 `gap-2` 防挤压 |
| chips 国家名 | `max-w-[160px] truncate` |
| ShareBar 按钮文案 | 短词（复制/已复制/重置），宽语言下 `whitespace-nowrap` 或允许两词 |
| 全部新文案 | 走 `messages/{locale}.json → compare` namespace，**keys × 11**；设计只定句式，翻译由内容侧出 |

### RTL（ar）
- **全部用逻辑属性**：`ms/me/ps/pe/start/end`，禁止 `ml/mr/pl/pr/left/right` 硬编码。
- sticky 首列：`inset-inline-start: 0`（RTL 下自动钉在右）。
- 年份箭头：`ChevronLeft/ChevronRight` 在 RTL 下 `rtl:rotate-180`（或按 `dir` 换图标）。
- chips：flex 自动反转；移除 `X` 用 `ms-auto`。
- 下拉面板：`end-0` 对齐右边缘。
- **验收**：ar 语言单独走查一遍矩阵 + chips + sticky（§13 清单含 RTL 走查）。

---

## 11. Token 补充（仅交互态，同 family）

```css
/* globals.css 追加（浅色） */
:root {
  --focus-ring: 0 0 0 3px rgba(79, 70, 229, 0.30);   /* brand #4f46e5 @ 30% */
  --highlight: color-mix(in srgb, var(--brand) 10%, transparent);   /* 行级浅底 L1 */
  --highlight-strong: color-mix(in srgb, var(--brand) 22%, transparent); /* 行级中底 L2 */
}
.dark {
  --focus-ring: 0 0 0 3px rgba(99, 102, 241, 0.40);
  --highlight: color-mix(in srgb, var(--brand) 18%, transparent);
  --highlight-strong: color-mix(in srgb, var(--brand) 32%, transparent);
}
```
- **不新增色相**：高亮全用 brand 深浅，与现有 next-holiday 卡（`bg-brand/5` + brand 边框）一致语言。
- `--focus-ring` 同时服务 FaqAccordion（另一份规约共用）。

---

## 12. 待用户确认项

| # | 项 | 现状 | 待确认 |
|---|---|---|---|
| 1 | 默认国 | top4 `US,GB,CA,AU`（已确认 POPULAR_COUNTRIES 前 4） | 是否要换成「按流量最大 4 国」？ |
| 2 | 上限 | 6 国（对齐竞品 2–6） | 是否放开到 8？ |
| 3 | URL 协议 | `c=US,GB,CA,AU&y=2026` | 是否接受 `c` 逗号分隔？ |
| 4 | 视图默认 | 移动 summary / 桌面 matrix | 是否桌面也默认 summary？ |
| 5 | 空月份 toggle | 默认关（P1 可选） | 是否首版就做？ |

---

## 13. 组件清单（交付前端用）

| 组件 | 类型 | 复用 | 说明 |
|---|---|---|---|
| `ComparePage` | server | — | 组合壳 + 取数（`getHolidays` 每国并发） |
| `CountryMultiSelect` | client | CountrySelector 搜索逻辑 | 多选 chips + 下拉 |
| `YearSwitcher` | server/client | YearNav | 年份 chips |
| `CompareMatrix` | server | 日期并集 + 高亮判定 | 行×列矩阵 |
| `CompareSummary` | server | — | 移动默认简化视图 |
| `CompareDensityStrip` | server | — | 12 格导航 |
| `CompareLegend` | server | — | 三层图例 |
| `ShareBar` | client | SubscribeButton clipboard | 复制/重置 |
| `ViewToggle` | client | — | summary/matrix 切换 |
| `EmptyState` / `CountryErrorCell` / `NoCommonHolidayRow` | server | country.dataLag 文案 | 状态组件 |

### 状态矩阵（§状态）
| 状态 | 表现 |
|---|---|
| 0 国 | 大空态 + 推荐国家 chips 引导选国 |
| 1 国 | 正常渲染 + 顶部提示「再选 1 国以对比」 |
| 加载 | 每国独立 skeleton 列（不整页转圈） |
| 单国错误 | 该国列显示错误 + 重试按钮；其余列正常 |
| 上游 204 | 该国列显示「无数据」 |
| 整年无共同假日 | 顶部近似态横幅「这些国家在 {year} 没有共同公共假日」+ 建议换年/换国 |
| 月份内无共同 | 月份块内一行「本月无共同假日」（保留，不消失） |

---

## 14. 开发依赖与验收

**开发依赖**：本骨架（§2 URL 协议 + §7 矩阵 + §8 移动方案）**冻结后**前端才可开工；
数据层无新依赖（复用 `getHolidays`）。

**验收清单（DoD）**
- [ ] 无 emoji：图标全 lucide（X/Plus/ChevronDown/Link2/RotateCcw/Users/Check/Globe/CalendarDays）
- [ ] 无紫粉渐变；无任何渐变
- [ ] 颜色全走 token（含 --focus-ring/--highlight，无裸 hex）
- [ ] URL 状态 = UI 状态；复制链接可还原
- [ ] 高亮三层：图例 + 颜色 + 文字 badge（不只靠颜色）
- [ ] 移动默认 summary 无横向滚动；完整矩阵有 sticky 首列
- [ ] 键盘可达：chips 移除按钮、添加下拉、年份、toggle 均可 Tab + Enter/Space
- [ ] focus-visible 全用 --focus-ring
- [ ] 深浅主题走查；ar RTL 单独走查
- [ ] 文案 keys 全进 `compare` namespace × 11
