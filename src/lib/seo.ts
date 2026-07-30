import type { Holiday } from "./types";

// Structured data helpers shared by country / year pages.
// Kept dependency-free so they can run at render time in RSC.

export function holidayItemList(
  countryName: string,
  year: number,
  holidays: Holiday[],
  locale?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "zh" ? `${countryName} ${year}?????` : `${countryName} public holidays ${year}`,
    itemListElement: holidays.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: h.name,
        startDate: h.date,
        ...(h.localName && h.localName !== h.name
          ? { alternateName: h.localName }
          : {}),
      },
    })),
  };
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// ==========================================
// Blog-related structured data helpers
// ==========================================

export function articleBreadcrumb(
  category: string,
  title: string,
  locale?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop"}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop"}/blog/${category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop"}/blog/${category}/${encodeURIComponent(title)}`,
      },
    ],
  };
}

export function articleStructuredData(
  title: string,
  description: string,
  author: string,
  publishedDate: string,
  lastModified: string,
  category: string,
  imageUrl: string,
  locale?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: locale === "zh" ? "??????" : "PubHoliday",
      logo: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 600,
        height: 600,
      },
    },
    datePublished: publishedDate,
    dateModified: lastModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop"}/blog/${category}/${encodeURIComponent(title)}`,
    },
    image: [
      {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    ],
    category: category,
  };
}

// ==========================================
// FAQ structured data for rich snippet capture
// ==========================================

export function faqPage(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}
