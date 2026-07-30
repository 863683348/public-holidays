"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

// Get your ad unit ID from Google AdSense → Ads → Display ads → Create new
// Replace the placeholder below with your actual ad unit ID
const AD_UNIT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_AD_UNIT ?? "";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot() {
  const t = useTranslations("ad");
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only inject the AdSense ad unit if AD_UNIT_SLOT is configured
    if (!AD_UNIT_SLOT || !insRef.current) return;

    try {
      // If the <ins> already has adsbygoogle pushed, skip
      if ((window.adsbygoogle || []).length > 0) return;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silently fail — ad blocker or network issue
    }
  }, []);

  // Placeholder mode: no ad unit configured
  if (!AD_UNIT_SLOT) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
        <span className="mb-2 block text-xs uppercase tracking-wide">
          {t("label")}
        </span>
        <div className="text-[var(--muted)]/60">— ad space —</div>
      </div>
    );
  }

  // Live AdSense display ad unit
  return (
    <div className="flex justify-center py-4">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="pub-9043592188127461"
        data-ad-slot={AD_UNIT_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
