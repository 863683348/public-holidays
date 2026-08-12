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

// 静态生成策略：所有语言 × 今年/明年 × 全部国家（≈11,000 页，构建 ~15 分钟）。
// 相比之前只预构建 en（~3,000 页），其余 11 语言全部走 ISR 首访触发函数执行 + 回源。
// 此次扩展到全量预构建，ISR Writes 从 ~110,000/月 降到 ~0（全部静态化）。
// 关键：此前 locale 硬编码 "en" 导致其他 11 语言 × 2年 × 500+ 节假日 = ~110,000 页
// 每次首访都触发 serverless 函数 + fetch date.nager.at → FOT/函数调用持续高的元凶。
export const revalidate = 604800;

export async function generateStaticParams() {
  const thisYear = new Date().getFullYear();
  const years = [thisYear, thisYear + 1];
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
