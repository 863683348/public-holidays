# 🌍 Public Holidays — Know the Holidays. Beat the Calendar.

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://public-holidays.shop)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org)
[![International](https://img.shields.io/badge/i18n-11%20languages-green)](https://public-holidays.shop)

A comprehensive public holidays lookup website — search public holidays in 44+ countries, plan long weekends, subscribe to calendars, and explore holiday-related guides.

**🌐 Live site: [https://public-holidays.shop](https://public-holidays.shop)**

---

## ✨ Features

- **🗓️ Country & Year Pages** — View all public holidays for any supported country, in 11 languages
- **📆 Long Weekend Planner** — Automatically identifies bridge-day opportunities to maximize time off
- **🔔 Calendar Subscription** — Subscribe to any country's holidays via ICS feed (Google / Apple / Outlook)
- **📝 Holiday Blog** — Guides, cultural insights, and practical advice about holidays worldwide
- **🌏 World Clock** — See current time and today's holidays across major cities
- **🌐 11 Languages** — Fully localized: 🇨🇳 中文 · 🇺🇸 English · 🇯🇵 日本語 · 🇰🇷 한국어 · 🇪🇸 Español · 🇩🇪 Deutsch · 🇫🇷 Français · 🇵🇹 Português · 🇮🇹 Italiano · 🇷🇺 Русский · 🇸🇦 العربية
- **⚡ ISR + SSG** — Pre-rendered with Incremental Static Regeneration for fast global load times
- **📱 Mobile-First** — Responsive design built with Tailwind CSS

---

## 🚀 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | [Next.js](https://nextjs.org) (App Router) | 15.1.6 |
| Language | TypeScript | 5.7 |
| Internationalization | [next-intl](https://next-intl.dev) | 3.26 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 3.4 |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 |
| Data Source | [Nager.Date API](https://date.nager.at) (free, open) | v3 |
| Deployment | [Vercel](https://vercel.com) | — |
| Caching | File system + Fetch `revalidate` | 90d TTL |

### Architecture

```
User → Cloudflare CDN → Vercel Edge → Next.js Runtime
                                         ├── SSG: Homepage / World Clock (11 languages)
                                         ├── SSG: sitemap.xml / robots.txt / blog sitemap
                                         ├── ISR: Country pages (44+ countries × 4 years)
                                         ├── ISR: Blog articles
                                         └── Dynamic: ICS calendar export / API endpoints
```

---

## 🏃 Getting Started

```bash
# Clone
git clone https://github.com/863683348/public-holidays.git
cd public-holidays

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | No | `https://public-holidays.shop` | Site URL for sitemaps and canonical URLs |

---

## 🌐 Internationalization

The site supports **11 languages** out of the box. Translations are in `src/i18n/messages/` as JSON files. The active locale is determined by the URL path prefix (e.g., `/en/US`, `/zh/CN`).

| Code | Language | BCP 47 |
|------|----------|--------|
| `zh` | 中文 | `zh-CN` |
| `en` | English | `en-US` |
| `ja` | 日本語 | `ja-JP` |
| `ko` | 한국어 | `ko-KR` |
| `es` | Español | `es-ES` |
| `de` | Deutsch | `de-DE` |
| `fr` | Français | `fr-FR` |
| `pt` | Português | `pt-PT` |
| `it` | Italiano | `it-IT` |
| `ru` | Русский | `ru-RU` |
| `ar` | العربية | `ar-SA` |

To add a new language: create a translation file, add it to `routing.ts`, update the middleware matcher, and add BCP 47 mapping in `layout.tsx`.

---

## 📊 SEO

This project implements a comprehensive SEO strategy:

- **P0/P1** — Independent metadata per page, correct hreflang + canonical, 4-year sitemap coverage, structured data (ItemList, BreadcrumbList, FAQPage, Article)
- **Content** — Country pages with dynamic intro + FAQ. Blog with topic clusters and internal linking.
- **International** — Precise BCP 47 language tags, hreflang x-default, 11-language hreflang clusters
- **Technical** — ISR (24h revalidation), security headers (CSP, HSTS), mobile-first responsive design

Sitemaps:
- Main: `/sitemap.xml` (≈2000+ URLs across all countries, years, and languages)
- Blog: `/blog/sitemap.xml` (all articles in all languages)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/            # Locale-aware pages
│   │   ├── page.tsx         # Homepage
│   │   ├── [country]/       # Country holiday pages
│   │   ├── blog/            # Blog section
│   │   └── world-clock/     # World clock utility
│   ├── blog/sitemap.ts      # Blog XML sitemap
│   ├── sitemap.ts           # Main XML sitemap
│   └── robots.ts            # Robots.txt
├── components/              # React components
├── i18n/
│   ├── messages/            # Translation JSON files (11 languages)
│   ├── routing.ts           # Locale configuration
│   └── request.ts           # i18n request handler
├── lib/
│   ├── blog-posts.ts        # Blog post data store
│   ├── countries.ts         # Country definitions (44+ countries)
│   ├── holidays.ts          # Holiday API client with caching
│   ├── longWeekend.ts       # Long weekend calculation logic
│   ├── seo.ts               # Structured data helpers
│   └── types.ts             # TypeScript interfaces
└── middleware.ts             # i18n routing middleware
```

---

## 🤝 Contributing

Contributions are welcome! The main areas where help is most valuable:

- **Translations** — Review and improve localization quality
- **Blog Content** — Write holiday guides and cultural articles (MDX or PR to `blog-posts.ts`)
- **Country Data** — Add more countries, verify holiday data accuracy
- **Features** — RTL support for Arabic, dark mode refinements, holiday comparison tools

---

## 📄 License

MIT License — see [LICENSE](LICENSE) (if applicable).

---

## 🙏 Credits

- [Nager.Date](https://date.nager.at) for providing the open public holiday API
- [next-intl](https://next-intl.dev) for seamless internationalization
- All holiday data is provided for reference. Always confirm with official sources before planning.
