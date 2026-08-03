"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";

function GoogleGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

interface AccountUser {
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function AccountClient({
  user,
  plan,
  status,
  currentPeriodEnd,
  navAccount,
  signInPrompt,
}: {
  user: AccountUser | null;
  plan: "free" | "pro";
  status: string | null;
  currentPeriodEnd: string | null;
  navAccount: string;
  signInPrompt: string;
}) {
  const { status: sessionStatus } = useSession();
  const tNav = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const tPricing = useTranslations("pricing");
  const tAccount = useTranslations("account");
  const format = useFormatter();

  // NextAuth's useSession is the authoritative client-side auth state.
  // The server pre-fills `user` for the logged-in case, but we still wait for
  // the client session resolution to avoid a flash / hydration mismatch.
  if (sessionStatus === "loading") {
    return (
      <div className="mx-auto max-w-3xl py-6 text-[var(--muted)]" aria-busy="true">
        {navAccount}…
      </div>
    );
  }

  const effectiveUser = user;

  const formatDate = (iso: string) =>
    format.dateTime(new Date(iso), { dateStyle: "long" });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">{navAccount}</h1>

      {!effectiveUser ? (
        <div className="mt-8 rounded-xl border border-[var(--border)] p-6">
          <p className="text-[var(--muted)]">{signInPrompt}</p>
          <button
            type="button"
            onClick={() => signIn("google")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <GoogleGlyph />
            {tAuth("signIn")}
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-6">
            {effectiveUser.image && (
              <img
                src={effectiveUser.image}
                alt=""
                width={56}
                height={56}
                referrerPolicy="no-referrer"
                className="h-14 w-14 shrink-0 rounded-full object-cover bg-[var(--border)]"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                {effectiveUser.name ?? effectiveUser.email}
              </p>
              {effectiveUser.email && (
                <p className="truncate text-sm text-[var(--muted)]">
                  {effectiveUser.email}
                </p>
              )}
            </div>
          </div>

          {plan === "pro" ? (
            <div className="rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{tAccount("pro")}</h2>
                <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-xs font-medium text-brand">
                  {tPricing("currentPlan")}
                </span>
              </div>

              {currentPeriodEnd &&
                (status === "canceling" ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {tAccount("expiresOn", { date: formatDate(currentPeriodEnd) })}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {tAccount("renewsOn", { date: formatDate(currentPeriodEnd) })}
                  </p>
                ))}

              <p className="mt-2 text-sm text-[var(--muted)]">
                {tAccount("managedBy")}
              </p>

              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-md border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:text-[var(--fg)]"
              >
                {tPricing("manage")}
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{tPricing("free")}</h2>
                <span className="rounded-full bg-[var(--border)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                  Free
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {tPricing("freePrice")}
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {tPricing("upgrade")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--fg)]"
          >
            {tAuth("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
