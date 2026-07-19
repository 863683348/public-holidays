import { useTranslations } from "next-intl";

// Free-tier ad placeholder. Swap the inner div for an AdSense/Carbon snippet later.
export default function AdSlot() {
  const t = useTranslations("ad");
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
      <span className="mb-2 block text-xs uppercase tracking-wide">
        {t("label")}
      </span>
      {/* Ad network snippet goes here */}
      <div className="text-[var(--muted)]/60">— ad space —</div>
    </div>
  );
}
