import type { Holiday, HolidayGroup } from "./types";

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
    name: locale === "zh" ? `${countryName} ${year}年公共假期` : `${countryName} public holidays ${year}`,
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
      name: "PubHoliday",
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

// ==========================================
// Single-holiday detail-page structured data (ADR-001 §6)
// ==========================================

/**
 * Event node for a single-date holiday group. `Event` here is for entity
 * disambiguation, not for Event rich results — expect GSC "valid with
 * warnings". Do NOT add offers / performer / venue to silence those warnings
 * (ADR-001 §6.1).
 */
export function holidayEvent(
  group: HolidayGroup,
  countryCode: string,
  countryName: string,
  locale: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    url,
    name: group.name,
    ...(group.localName && group.localName !== group.name
      ? { alternateName: group.localName }
      : {}),
    startDate: group.primaryDate,
    endDate: group.primaryDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    inLanguage: locale,
    location: {
      "@type": "Place",
      name: countryName,
      address: {
        "@type": "PostalAddress",
        addressCountry: countryCode,
      },
    },
  };
}

/**
 * ItemList of Event nodes for a multi-date holiday group (dates.length > 1),
 * one Event per date. When a date maps to records carrying a single ISO-3166-2
 * region code, that code is emitted as `addressRegion` — real data, never
 * fabricated. Mirrors the `holidayItemList` convention.
 */
export function holidayEventList(
  group: HolidayGroup,
  countryCode: string,
  countryName: string,
  locale: string,
  url: string
) {
  const year = group.primaryDate.slice(0, 4);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${group.name} — ${countryName} ${year}`,
    itemListElement: group.dates.map((date, i) => {
      const onDate = group.records.filter((r) => r.date === date);
      const regionCodes = [
        ...new Set(onDate.flatMap((r) => r.counties ?? [])),
      ];
      const address = {
        "@type": "PostalAddress",
        addressCountry: countryCode,
        // Only when unambiguous — a single region code for this date.
        ...(regionCodes.length === 1 ? { addressRegion: regionCodes[0] } : {}),
      };
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Event",
          name: group.name,
          startDate: date,
          endDate: date,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          isAccessibleForFree: true,
          inLanguage: locale,
          location: {
            "@type": "Place",
            name: countryName,
            address,
          },
        },
      };
    }),
  };
}

// ==========================================
// Detail-page WebPage structured data (SPEC-002 §3b) — the fourth ld+json
// block on HolidayDetailView. Mirrors the WebPage shape on the country/year
// pages (author/publisher/isPartOf Organization "PubHoliday"), with
// `mainEntity` pointing at the Event node's @id instead of an inline list.
// ==========================================

export function webPageDetail(opts: {
  canonical: string;
  title: string;
  description: string;
  locale: string;
  dateModified: string;
  eventId: string;
}): Record<string, unknown> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": opts.canonical,
    url: opts.canonical,
    name: opts.title,
    description: opts.description,
    inLanguage: opts.locale,
    dateModified: opts.dateModified,
    author: { "@type": "Organization", name: "PubHoliday", url: siteUrl },
    publisher: { "@type": "Organization", name: "PubHoliday", url: siteUrl },
    isPartOf: { "@type": "WebSite", name: "PubHoliday", url: siteUrl },
    mainEntity: { "@id": opts.eventId },
  };
}
