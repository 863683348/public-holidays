"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

export default function SubscribeButton({
  country,
  label,
  hint,
}: {
  country: string;
  label: string;
  hint: string;
}) {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const href = `/${locale}/${country}/calendar.ics`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${href}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-1 text-right">
      <a
        href={href}
        className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg transition hover:opacity-90"
      >
        {label}
      </a>
      <div>
        <button
          type="button"
          onClick={copy}
          className="text-xs text-[var(--muted)] underline"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <p className="text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}
