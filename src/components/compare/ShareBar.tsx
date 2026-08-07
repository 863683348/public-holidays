"use client";

import { useEffect, useState } from "react";
import { Link2, Check, RotateCcw } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { encodeShareUrl, DEFAULT_SELECTION, DEFAULT_YEAR } from "@/lib/compare";
import { comparePath } from "./shareUrl";

const base =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]";
const primary = "bg-brand text-brand-fg hover:opacity-90";
const ghost =
  "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--brand)]";

/**
 * Copy-to-clipboard share bar + reset-to-defaults. The share URL is the
 * current c/y snapshot (encodeShareUrl), built from the SSR'd selection so it
 * round-trips through parseCompareParams.
 */
export default function ShareBar({
  codes,
  year,
}: {
  codes: string[];
  year: number;
}) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = origin ? encodeShareUrl(origin, locale, codes, year) : "";

  const copy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (non-secure context) — leave button idle.
    }
  };

  const reset = () => {
    router.replace(comparePath(DEFAULT_SELECTION, DEFAULT_YEAR));
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
      <p
        className="min-w-0 flex-1 truncate font-mono text-xs text-[var(--muted)]"
        title={shareUrl || undefined}
      >
        {shareUrl || t("share")}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={copy} className={`${base} ${primary}`}>
          {copied ? (
            <Check size={16} aria-hidden />
          ) : (
            <Link2 size={16} aria-hidden />
          )}
          {copied ? t("copied") : t("share")}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label={t("reset")}
          className={`${base} ${ghost}`}
        >
          <RotateCcw size={16} aria-hidden />
          <span className="hidden sm:inline">{t("reset")}</span>
        </button>
      </div>
    </div>
  );
}
