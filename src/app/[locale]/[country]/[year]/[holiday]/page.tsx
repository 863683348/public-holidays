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

// 静态生成策略：en 语言 × 今年/明年 × 全部国家（≈3,000 页，构建 ~5-10 分钟）。
// 全量（12 语言 × 7 年）URL 空间 ~13 万页不现实，因此只 prebuild SEO 主力
// （en + 当前两个年份）；其余语言/年份组合靠 dynamicParams 按需 ISR 生成并缓存。
// 关键：此前无 generateStaticParams 时页面被当作纯动态渲染（每次请求执行函数 +
// fetch date.nager.at + 响应强制 private,no-cache）→ 是 FOT/函数调用持续高的元凶。
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
      for (const g of groupHolidays(holidays)) {
        params.push({
          locale: "en",
          country: c.code,
          year: String(y),
          holiday: g.slug,
        });
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
