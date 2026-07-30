import Script from "next/script";
import { useTranslations } from "next-intl";

// Set this to your Carbon Ads serve ID after registration, or keep empty for placeholder
const CARBON_SERVE = process.env.NEXT_PUBLIC_CARBON_SERVE ?? "";

export default function AdSlot() {
  const t = useTranslations("ad");

  if (!CARBON_SERVE) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
        <span className="mb-2 block text-xs uppercase tracking-wide">{t("label")}</span>
        <div className="text-[var(--muted)]/60">— ad space —</div>
      </div>
    );
  }

  return (
    <div className="carbon-ad-wrapper flex justify-center py-4">
      <div id="carbonads" />
      <Script
        id="carbon-ad"
        strategy="afterInteractive"
        src={`//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE}&placement=public-holidays-shop`}
      />
    </div>
  );
}