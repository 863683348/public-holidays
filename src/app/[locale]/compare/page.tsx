import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  parseCompareParams,
  resolveCompareSelection,
  computeCompareMatrix,
} from "@/lib/compare";
import { getHolidays } from "@/lib/holidays";
import { COUNTRIES, getCountryName } from "@/lib/countries";
import type { CompareViewMode } from "@/components/compare/shareUrl";
import ShareBar from "@/components/compare/ShareBar";
import MultiSelect from "@/components/compare/MultiSelect";
import YearSwitcher from "@/components/compare/YearSwitcher";
import CompareLegend from "@/components/compare/CompareLegend";
import ViewToggle from "@/components/compare/ViewToggle";
import AllOffBlock from "@/components/compare/AllOffBlock";
import NearMiss from "@/components/compare/NearMiss";
import CompareSummary from "@/components/compare/CompareSummary";
import CompareDensityStrip from "@/components/compare/CompareDensityStrip";
import CompareMatrix from "@/components/compare/CompareMatrix";
import AdSlot from "@/components/AdSlot";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// ISR: holiday data is fetch-cached 90d upstream; re-render the shell daily.

type SearchParams = Record<string, string | string[] | undefined>;

function spParam(sp: SearchParams, key: string): string | null {
  const v = sp[key];
  if (typeof v === "string" && v.length > 0) return v;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // Query-param URLs are never indexed; the value of /compare is shareability.
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}/${locale}/compare` },
  };
}

/**
 * Months with at least one holiday across the selection — drives the
 * density strip. Pure data, no DOM access.
 */
function computeActiveMonths(
  countries: { holidays: { date: string }[] }[]
): boolean[] {
  const active = Array(12).fill(false) as boolean[];
  for (const country of countries) {
    for (const holiday of country.holidays) {
      const monthIndex = Number(holiday.date.slice(5, 7)) - 1;
      if (monthIndex >= 0 && monthIndex < 12) active[monthIndex] = true;
    }
  }
  return active;
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "compare" });
  const tCal = await getTranslations({ locale, namespace: "calendar" });
  const months = tCal.raw("months") as string[];

  // Selection is driven entirely by the URL — UI mutations just re-navigate.
  const parsed = parseCompareParams(spParam(sp, "c"), spParam(sp, "y"));
  const selection = parsed
    ? resolveCompareSelection(parsed.codes, parsed.year)
    : resolveCompareSelection([], null);

  const results = await Promise.allSettled(
    selection.codes.map((code) => getHolidays(code, selection.year))
  );
  const countries = selection.codes.map((code, i) => ({
    code,
    name: getCountryName(code, locale),
    holidays: results[i].status === "fulfilled" ? results[i].value : [],
  }));

  // Upstream completely unavailable → honest fallback instead of a fake "no
  // shared holiday" matrix (mirrors the dataLag pattern on country pages).
  if (results.every((r) => r.status === "rejected")) {
    const tData = await getTranslations("country");
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("heading")}</h1>
        <p className="text-[var(--muted)]">{tData("dataLag")}</p>
      </div>
    );
  }

  const matrix = computeCompareMatrix(countries, selection.year);
  const viewParam = spParam(sp, "view");
  const view: CompareViewMode =
    viewParam === "summary" || viewParam === "matrix" ? viewParam : "auto";

  const countryOptions = COUNTRIES.map((c) => ({
    code: c.code,
    name: getCountryName(c.code, locale),
    nameEn: c.name,
  }));

  // Layout rules for view + viewport:
  //   auto   → mobile summary / desktop matrix (md:hidden summary, hidden md:block matrix)
  //   summary → both viewports: summary only
  //   matrix  → both viewports: matrix only
  const showSummary = view !== "matrix";
  const showMatrix = view !== "summary";
  const summaryClass =
    view === "auto" ? "md:hidden" : "block";
  const matrixClass =
    view === "auto" ? "hidden md:block" : "block";

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("heading")}</h1>
        <p className="max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      </header>

      <ShareBar codes={selection.codes} year={selection.year} />

      <MultiSelect
        codes={selection.codes}
        year={selection.year}
        countryOptions={countryOptions}
      />

      <YearSwitcher codes={selection.codes} year={selection.year} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <CompareLegend />
        <ViewToggle view={view} codes={selection.codes} year={selection.year} />
      </div>

      {matrix.allOff.length > 0 ? (
        <AllOffBlock matrix={matrix} locale={locale} />
      ) : (
        <NearMiss matrix={matrix} locale={locale} />
      )}

      {showSummary && (
        <div className={summaryClass}>
          <CompareSummary matrix={matrix} locale={locale} />
        </div>
      )}

      {showMatrix && (
        <div className={matrixClass}>
          <CompareDensityStrip
            active={computeActiveMonths(countries)}
            months={months}
          />
          <div className="mt-4">
            <CompareMatrix matrix={matrix} locale={locale} months={months} />
          </div>
        </div>
      )}

      <AdSlot />
    </div>
  );
}