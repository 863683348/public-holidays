# DESIGN — `FaqAccordion` 组件规约

> 作者：颜好看（UI/UX Designer）｜日期：2026-08-07
> 状态：**设计先行项 #2（组件规约）**——前端替换现有两处 FAQ 前必须先读本文件。
> 统一对象：`CountryHolidayView` 内联 FAQ（L369-381）+ `HolidayDetailView` 的 `HolidayFaq.tsx`。
> P0 红线：图标用 lucide-react（禁 emoji）｜无紫粉渐变｜复用现有 5 色 token，
> 仅补 `--focus-ring`（与 compare 骨架共用，见 §6）。

---

## 1. 目标与行为决策

- 把两处「border-b 纯列表 FAQ」统一为一个**可交互、可折叠、无障碍完整**的组件。
- **行为 = 独立开合（多开）手风琴，非互斥单开**，且**默认全展开**。理由：
  1. SEO 站点：FAQ 内容是要被搜索引擎读的，默认全展开保证首屏内容完整、不依赖 JS 展开。
  2. FAQ 是扫读场景：用户想快速扫全部问题，全展开利于浏览；互斥单开反而强制「一次看一条」。
  3. 与现有实现（全展开 border-b 列表）视觉延续，迁移成本最低。
  4. 仍允许用户点按折叠单条——交互能力保留，只是默认值不同。

---

## 2. Props / API（冻结项）

```ts
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** 默认展开策略：true=全部展开（推荐，SEO）；false=全部折叠；number[]=指定索引展开 */
  defaultOpen?: boolean | number[];
  /** 问题头的标题级别：CountryHolidayView 用 h2（外层无独立标题），详情页用 h3（外层已有 h2 标题） */
  headingLevel?: "h2" | "h3";
  className?: string;
}
```

- `items` 复用现有 `FaqItem` 结构——**JSON-LD 数据流不变**：
  父组件仍从同一 `items` 数组输出 `FAQPage` 结构化数据，页面可见文案与 schema 永不漂移
  （沿用 `HolidayFaq.tsx` 的既有机制）。
- 默认值：`defaultOpen = true`、`headingLevel = "h3"`。

---

## 3. DOM 结构（每项）

```html
<div class="faq-item border-b border-[var(--border)] last:border-0">
  <{headingLevel} class="m-0">
    <button
      id="faq-trigger-{i}"
      type="button"
      aria-expanded="true|false"
      aria-controls="faq-panel-{i}"
      class="faq-trigger"
    >
      <span class="faq-question">{question}</span>
      <ChevronDown size={16} strokeWidth={1.75} aria-hidden class="faq-chevron" />
    </button>
  </{headingLevel}>
  <div
    id="faq-panel-{i}"
    role="region"
    aria-labelledby="faq-trigger-{i}"
    class="faq-panel"
  >
    <p class="faq-answer">{answer}</p>
  </div>
</div>
```

- 列表根：`<div>`（非 `<ul>`，因内部有 `h2/h3` 标题元素，语义上不是纯列表）。
- 图标：lucide `ChevronDown`（`aria-hidden`，语义由文字承载）。

---

## 4. 状态矩阵

| 状态 | 表现 |
|---|---|
| Default（折叠） | 问题可见，面板隐藏，chevron 朝下，`aria-expanded="false"` |
| Expanded | 面板可见，chevron 旋转 180°，`aria-expanded="true"` |
| Hover（触发按钮） | `hover:text-[var(--brand)]`，150ms 过渡 |
| Focus-visible | `--focus-ring` 3px 环 + `rounded-md`（见 §6） |
| Active（按下） | `bg-[var(--card)]` 或 `bg-[var(--highlight)]`（与 compare 共用 token） |
| Loading | 无——SSR 同步渲染，不涉及异步 |
| Error | 无——answer 为纯文本，无取数失败 |
| Empty | `items.length === 0` → 返回 `null`（沿用现有行为） |
| Success | 展开即反馈（无 toast 需要） |

---

## 5. 无障碍与键盘（冻结项）

- **aria**：
  - 按钮：`aria-expanded` + `aria-controls`（指向面板 id）
  - 面板：`role="region"` + `aria-labelledby`（指向按钮 id）
  - 图标：`aria-hidden`
- **键盘**（WAI-ARIA Accordion 模式，渐进增强）：
  - `Tab`：在触发按钮间移动（原生）
  - `Enter` / `Space`：切换该条开合
  - 可选增强：`↑`/`↓` 在按钮间移动焦点；`Home`/`End` 到首/尾（P1，实现成本低）
- **焦点可见**：所有触发按钮 `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--brand)]/30`（封装为 `--focus-ring` token）。
- **命中区**：触发按钮 `min-h-[44px]`（`py-3`），符合 WCAG 2.5.5。
- **不只靠颜色**：开合状态由 chevron 方向 + `aria-expanded` + 面板显隐三重表达。

---

## 6. 样式 token（冻结项）

```css
/* globals.css 追加（与 compare 骨架共用） */
:root {
  --focus-ring: 0 0 0 3px rgba(79, 70, 229, 0.30);
  --highlight: color-mix(in srgb, var(--brand) 10%, transparent); /* Active 按压底，可选 */
}
.dark {
  --focus-ring: 0 0 0 3px rgba(99, 102, 241, 0.40);
  --highlight: color-mix(in srgb, var(--brand) 18%, transparent);
}
```

组件内**只用**：`--border`（分隔）、`--fg` / `--muted`（文字）、`--brand`（hover/active）、
`--card`（按压底）、`--focus-ring`（焦点）。**无裸 hex、无渐变**。

### 组件内样式表（实现参考）
| 元素 | 样式 |
|---|---|
| `.faq-item` | `border-b border-[var(--border)] last:border-0` |
| `.faq-trigger` | `flex w-full items-center justify-between gap-3 py-3 text-start font-medium min-h-[44px] transition-colors hover:text-[var(--brand)]` |
| `.faq-question` | 不 truncate，允许自然换行（多语言长句） |
| `.faq-chevron` | `shrink-0 text-[var(--muted)] transition-transform duration-150`；展开时 `rotate-180` |
| `.faq-panel` | 展开可见；折叠隐藏 |
| `.faq-answer` | `pb-3 text-sm leading-relaxed text-[var(--muted)]` |

---

## 7. 动效（冻结项）

- 开合过渡：**150–200ms**，`ease-standard`（`cubic-bezier(0.2,0,0,1)`）。
- 实现方式（前端选一）：
  - `grid-template-rows: 0fr → 1fr` + `overflow: hidden`（推荐，无魔法数字高度）
  - 或 `max-height` 过渡（需估计高度）
- chevron：`rotate` 180°，150ms。
- **`prefers-reduced-motion`**：以上动画全部禁用（直接显隐），必须在 CSS 中声明：
  ```css
  @media (prefers-reduced-motion: reduce) {
    .faq-panel, .faq-chevron { transition: none; }
  }
  ```

---

## 8. RTL & 11 语言

- `text-start`（非 `text-left`）保证 ar 下问题右对齐。
- chevron 在右侧：用 `ms-auto` 逻辑间距（flex `justify-between` 已天然处理，无需额外）。
- 问题/答案**不 truncate**、允许换行——德/俄/日长句自然折行。
- 文案 keys 全走现有 `country` / `holidayDetail` namespace（问题句式已有），**无新增文案**。

---

## 9. 替换映射（冻结项）

| # | 位置 | 现实现 | 改为 |
|---|---|---|---|
| 1 | `HolidayFaq.tsx` | border-b 纯列表 | 重构为 `FaqAccordion`（`defaultOpen=true`，`headingLevel="h3"`），保持导出 `FaqItem` 类型 |
| 2 | `CountryHolidayView.tsx` L369-381 | 内联 `space-y-4` + border-b div 列表 | 外层保留 `<h2>{t("faqHeading")}</h2>`，列表换 `<FaqAccordion items={faqItems} headingLevel="h2" />` |
| 3 | `HolidayDetailView.tsx` | 已用 `<HolidayFaq items={faqItems} />` | 组件内部升级即自动继承，页面无需改动 |
| 4 | `/[locale]/faq` 静态页 | `LegalPage` 内联静态 Q&A（硬编码英文） | **低优先（P2）**：该页是静态长文、无 JSON-LD 联动；可后续统一，首版不动 |

> 注意：替换 #2 时保持 `faqItems` 数组与 `faqPage()` JSON-LD 输出**同一个数组**（现状已如此，勿拆）。

---

## 10. 验收清单（DoD）

- [ ] 无 emoji：图标仅 lucide `ChevronDown`
- [ ] 无渐变；无裸 hex（全 token）
- [ ] `aria-expanded` / `aria-controls` / `role="region"` / `aria-labelledby` 齐全
- [ ] Tab + Enter/Space 可操作；focus-visible 用 `--focus-ring`
- [ ] 触发按钮命中区 ≥44px
- [ ] 默认全展开；可单条折叠；`defaultOpen` 支持 false / 索引数组
- [ ] 开合动效 150–200ms；`prefers-reduced-motion` 禁用
- [ ] 深浅主题走查；ar RTL 走查（text-start / ms-auto）
- [ ] `items.length === 0` → 返回 null（不渲染空壳）
- [ ] JSON-LD 与可见文案共用同一 `items` 数组（不漂移）
