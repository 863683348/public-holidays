"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signIn } from "next-auth/react";

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function PricingPage({
  userEmail,
  status,
}: {
  userEmail: string | null;
  status: string | null;
}) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(false);
  const isLoggedIn = sessionStatus === "authenticated" || Boolean(userEmail);

  async function handleUpgrade() {
    if (!isLoggedIn) {
      // Not signed in — redirect to Google sign-in, then back to pricing
      signIn("google", { callbackUrl: `/${locale}/pricing` });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        // Server-side redirect style: navigate current tab to checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error ?? "Failed to start checkout");
        setLoading(false);
      }
    } catch {
      alert("Network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-[var(--muted)]">{t("subtitle")}</p>

      {status === "success" && (
        <div className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm text-green-700 dark:text-green-400">
          {t("successMsg")}
        </div>
      )}
      {status === "pending" && (
        <div className="mt-6 rounded-lg border border-amber-600/30 bg-amber-600/10 p-4 text-sm text-amber-700 dark:text-amber-400">
          {t("pendingMsg")}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Free plan */}
        <div className="flex flex-col rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold">{t("free")}</h2>
          <p className="mt-2 text-3xl font-bold">
            {t("freePrice")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {(t.raw("freeFeatures") as string[]).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-md border border-[var(--border)] px-4 py-2 text-center text-sm text-[var(--muted)]">
            {t("currentPlan")}
          </div>
        </div>

        {/* Pro plan */}
        <div className="flex flex-col rounded-xl border-2 border-brand p-6 shadow-lg shadow-brand/5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand">{t("pro")}</h2>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
              Pro
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">
            {t("proPrice")}
            <span className="text-sm font-normal text-[var(--muted)]">
              {t("proPeriod")}
            </span>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {(t.raw("proFeatures") as string[]).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="mt-6 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "..."
              : isLoggedIn
                ? t("upgrade")
                : t("upgradeHint")}
          </button>
        </div>
      </div>
    </div>
  );
}
