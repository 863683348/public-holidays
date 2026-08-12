import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  parseCompareParams,
  resolveCompareSelection,
  computeCompareMatrix,
} from "@/lib/compare";
import { getHolidays } from "@/lib/holidays";
import { COUNTRIES, getCountryName } from "@/lib/countries";
import ShareBar from "@/components/compare/ShareBar";
import MultiSelect from "@/components/compare/MultiSelect";
import YearSwitcher from "@/components/compare/YearSwitcher";
import CompareView from "@/components/compare/CompareView";
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
  const initialView: "auto" | "summary" | "matrix" =
    viewParam === "summary" || viewParam === "matrix" ? viewParam : "auto";

  const countryOptions = COUNTRIES.map((c) => ({
    code: c.code,
    name: getCountryName(c.code, locale),
    nameEn: c.name,
  }));

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

      <CompareView matrix={matrix} initialView={initialView} />

      <AdSlot />
    </div>
  );
}
