"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { CompareViewMode } from "@/components/compare/shareUrl";
import { comparePath } from "@/components/compare/shareUrl";

const base =
  "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]";
const idle =
  "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--brand)]";
const active =
  "border-[var(--brand)] bg-brand text-white";

/**
 * Lightweight client boundary — only the toggle buttons need JS. Clicking a
 * pinned view calls router.replace so the URL (?view=...) stays canonical
 * and the server re-renders the right panel. The matrix / summary bodies
 * themselves are server components now, so this file is the entire client
 * footprint of the compare surface besides MultiSelect + ShareBar.
 */
export default function ViewToggle({
  view,
  codes,
  year,
}: {
  view: CompareViewMode;
  codes: string[];
  year: number;
}) {
  const t = useTranslations("compare");
  const router = useRouter();
  const opts: { value: Exclude<CompareViewMode, "auto">; label: string }[] = [
    { value: "summary", label: t("viewSummary") },
    { value: "matrix", label: t("viewMatrix") },
  ];
  const go = (next: Exclude<CompareViewMode, "auto">) => {
    const target = view === next ? "auto" : next;
    router.replace(comparePath(codes, year, target === "auto" ? undefined : target));
  };
  return (
    <div
      role="group"
      aria-label={t("viewSummary")}
      className="inline-flex rounded-md border border-[var(--border)] p-0.5"
    >
      {opts.map((opt) => {
        const isActive = view === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => go(opt.value)}
            aria-pressed={isActive}
            className={`${base} ${isActive ? active : idle}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}