import { getTranslations } from "next-intl/server";

/**
 * Three-level highlight legend (all/some/none). Color is never the only
 * signal — the row badge + legend text carry the meaning too.
 * Server component — no client JS needed for this static label group.
 */
export default async function CompareLegend() {
  const t = await getTranslations("compare");
  const items = [
    {
      label: t("legendAll"),
      swatch: "border-[var(--brand)]/50 bg-[var(--highlight-strong)]",
    },
    {
      label: t("legendSome"),
      swatch: "border-[var(--brand)]/30 bg-[var(--highlight)]",
    },
    {
      label: t("legendNone"),
      swatch: "border-[var(--border)] bg-[var(--card)]",
    },
  ];
  return (
    <div
      role="group"
      aria-label={t("legendHeading")}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)]"
    >
      {items.map((item: any) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className={`inline-block h-3 w-3 rounded-sm border ${item.swatch}`}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}