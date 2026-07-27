import type { Holiday } from "./types";

// Structured data helpers shared by country / year pages.
// Kept dependency-free so they can run at render time in RSC.

export function holidayItemList(
  countryName: string,
  year: number,
  holidays: Holiday[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${countryName} public holidays ${year}`,
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
