import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCountry,
  getHolidayDetailTitle,
  getHolidayDetailDescription,
} from "@/lib/countries";
import type { Holiday } from "@/lib/types";
import { parseYear } from "@/lib/year-window";
import { getHolidays } from "@/lib/holidays";
import { findHolidayGroup, groupHolidays } from "@/lib/slug";
import { routing } from "@/i18n/routing";
import HolidayDetailView from "@/components/HolidayDetailView";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// FOT 友好预构建：12 语言 × Top20 市场 × 2 年（2026-2027）× 节日 ≈ 7K 页（原 ≈110K）。长尾走 dynamicParams 按需渲染 + 边缘缓存。
// 仅预构建高价值 hero 集合；其余长尾（非 Top20 国家 / 更早年份）保持 dynamicParams=true，
// 首次访问按需渲染后由 next.config 的 s-maxage=604800 在边缘缓存 7 天。不再用时间型 revalidate，
// 避免 ISR Writes 超额；数据更新走 /api/revalidate 按需重建。

const TOP_COUNTRIES = ["US","GB","CA","AU","DE","FR","ES","IT","NL","IE","SE","CH","AT","BE","PT","PL","JP","IN","BR","AE"];

export async function generateStaticParams() {
  const years = [2026, 2027];
  const params: {
    locale: string;
    country: string;
    year: string;
    holiday: string;
  }[] = [];
  for (const c of TOP_COUNTRIES) {
    for (const y of years) {
      let holidays: Holiday[];
      try {
        holidays = await getHolidays(c, y);
      } catch {
        continue; // 数据不可达国家跳过，避免整个构建失败
      }
      for (const l of routing.locales) {
        for (const g of groupHolidays(holidays)) {
          params.push({
            locale: l,
            country: c,
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
