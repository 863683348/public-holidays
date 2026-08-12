import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCountry,
  getHolidayDetailTitle,
  getHolidayDetailDescription,
} from "@/lib/countries";
import { COUNTRIES } from "@/lib/countries";
import type { Holiday } from "@/lib/types";
import { parseYear } from "@/lib/year-window";
import { getHolidays } from "@/lib/holidays";
import { findHolidayGroup, groupHolidays } from "@/lib/slug";
import { routing } from "@/i18n/routing";
import HolidayDetailView from "@/components/HolidayDetailView";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// 静态生成策略：所有语言 × 5 年（2024-2028）× 全部国家（≈110,000 页，构建 ~30 分钟）。
// 相比方案一（2 年，~49,798 页），扩展 3 年缓冲覆盖，进一步消除 ISR。
// ISR Writes 保持为 0（全部静态化）。构建时间较长但一次性成本，
// 换来的是一年内任意年份/语言的节假日详情页都从 CDN 边缘直接命中。
// 关键：locale 遍历所有 12 语言，确保每种语言的节假日详情页都预构建。
export const revalidate = 604800;

export async function generateStaticParams() {
  const years = [2024, 2025, 2026, 2027, 2028];
  const params: {
    locale: string;
    country: string;
    year: string;
    holiday: string;
  }[] = [];
  for (const c of COUNTRIES) {
    for (const y of years) {
      let holidays: Holiday[];
      try {
        holidays = await getHolidays(c.code, y);
      } catch {
        continue; // 数据不可达国家跳过，避免整个构建失败
      }
      for (const l of routing.locales) {
        for (const g of groupHolidays(holidays)) {
          params.push({
            locale: l,
            country: c.code,
            year: String(y),
            holiday: g.slug,
          });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    country: string;
    year: string;
    holiday: string;
  }>;
}): Promise<Metadata> {
  const { locale, country, year, holiday } = await params;
  const meta = getCountry(country);
  const y = parseYear(year);
  if (!meta || y === null) return {};

  let group;
  try {
    const holidays = await getHolidays(meta.code, y);
    group = findHolidayGroup(holidays, holiday);
  } catch {
    return {};
  }
  if (!group) return {};

  const dateLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(group.primaryDate + "T00:00:00Z"));

  const title = getHolidayDetailTitle(group.name, country, locale, y);
  const description = getHolidayDetailDescription(
    group.name,
    country,
    locale,
    y,
    dateLabel
  );

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}/${meta.code}/${y}/${group.slug}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${meta.code}/${y}/${group.slug}`,
      languages: {
        ...languages,
        "x-default": `${SITE_URL}/en/${meta.code}/${y}/${group.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/${meta.code}/${y}/${group.slug}`,
      type: "article",
    },
  };
}

export default async function HolidayDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    country: string;
    year: string;
    holiday: string;
  }>;
}) {
  const { locale, country, year, holiday } = await params;
  const y = parseYear(year);
  if (y === null) notFound();
  return (
    <HolidayDetailView
      locale={locale}
      country={country}
      year={y}
      slug={holiday}
    />
  );
}
