# 多语言翻译模板指南

## 当前支持的翻译文件

- `en.json`（英语）— 已有完整翻译
- `zh.json`（中文）— 已有完整翻译
- `es.json`（西班牙语）— 已有完整翻译
- `fr.json`（法语）— 已有完整翻译
- `de.json`（德语）— 已有完整翻译
- `ko.json`（韩语）— 新骨架（待填充）
- `ru.json`（俄语）— 新骨架（待填充）
- `ar.json`（阿拉伯语）— 新骨架（待填充）
- `pt.json`（葡萄牙语（巴西））— 新骨架（待填充）
- `ja.json`（日语）— 骨架（含本地化注释）

## 如何填充翻译

1. 打开任意 `{lang}.json` 文件
2. 将所有 `""` 替换为该语言的本地化文本
3. `calendar.weekdays` 和 `calendar.months` 数组填充对应的短格式和全格式月份/星期名称
4. `longWeekend.takeGet` 是带 `{bridge}` 占位的字符串，翻译时保留 `{bridge}` 不变（例如："{bridge} を取る"）

## SEO 关键文本本地化建议

| 键 | 英文原文 | 本地化建议 |
|---|---|---|
| `site.title` | PubHoliday | 品牌名可保留或本地化（日语建议：パブホリデイ） |
| `site.tagline` | Know the holidays. Beat the calendar. | 不要直译，要本地化成有吸引力的标语 |
| `home.heading` | Public holidays, worldwide | 各国搜索词差异大，务必本地化 |
| `country.yearView` | Holiday calendar {year} | 保留 `{year}` 占位符 |
| `yearNav.prev/next` | Previous year {year} / Next year {year} | 保留 `{year}` 占位符 |

## 重要提醒

- **不要使用机器翻译直接上线**："Public Holidays" 等关键术语在不同语言中有不同表达（德语: Feiertage, 日语: 祝日, 西班牙语: Festivos），应使用母语者或专业翻译服务
- **占位符必须保留**：所有 `{xxx}` 占位符在翻译中必须原样保留，next-intl 会替换实际值
- **日期/月份数组**：`calendar.months` 必须按 1-12 月顺序排列，`calendar.weekdays` 建议按当地习惯顺序
- **RTL 语言**（如阿拉伯语 ar）：需要在 CSS 中处理文本方向（`dir="rtl"`），可在 layout 中根据 locale 设置

## 验证填充后

运行 `npm run build` 或 `next build` 确认无 JSON 解析错误。
