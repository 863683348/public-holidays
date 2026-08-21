import type { MetadataRoute } from "next";
import { COUNTRIES, NO_DATA_COUNTRIES } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { groupHolidays } from "@/lib/slug";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

// 仅列出 en + zh 的节日详情 URL（与 generateStaticParams 保持一致，-83% 条目）。
// 其他语言详情页走 dynamicParams 按需渲染；metadata alternates 保留全 12 语言链接。

const CONCURRENCY = 10;

export default async function holidaysSitemap(): Promise<MetadataRoute.Sitemap> {
  const year = new Date().getFullYear();
  // Skip countries the upstream has no data for — they'd only yield 204/[]
  // (the empty result is a second safety net for anything not in the set).
  const countries = COUNTRIES.filter(
    (c) => !NO_DATA_COUNTRIES.has(c.code.toUpperCase())
  );

  const slugsByCountry: { code: string; slugs: string[] }[] = [];
  let cursor = 0;
  async function worker() {
    while (cursor < countries.length) {
      const c = countries[cursor++];
      try {
        const holidays = await getHolidays(c.code, year);
        const slugs = groupHolidays(holidays).map((g) => g.slug);
        if (slugs.length > 0) slugsByCountry.push({ code: c.code, slugs });
      } catch {
        // Upstream timeout/error — omit this country from this build. It will
        // be picked up on the next daily revalidation.
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const urls: MetadataRoute.Sitemap = [];
  const lastModified = new Date();
  for (const { code, slugs } of slugsByCountry) {
    for (const slug of slugs) {
      for (const l of ["en", "zh"]) {
        urls.push({
          url: `${SITE_URL}/${l}/${code}/${year}/${slug}`,
          lastModified,
          changeFrequency: "yearly",
          priority: 0.5,
        });
      }
    }
  }
  return urls;
}
