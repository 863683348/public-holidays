"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import GoogleLogin from "@/components/GoogleLogin";

const NAV_KEYS = [
  { href: "/compare", key: "compare" },
  { href: "/today", key: "today" },
  { href: "/world-clock", key: "worldClock" },
  { href: "/pricing", key: "pricing" },
  { href: "/account", key: "account" },
] as const;

export default function MobileMenu() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden" ref={wrapRef}>
      <button
        type="button"
        aria-label={open ? tAuth("signOut") ? "Close menu" : "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] transition-colors hover:border-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
      </button>
      {open && (
        <div
          id="mobile-menu-panel"
          role="dialog"
          aria-label="Site menu"
          className="fixed inset-x-0 top-[calc(theme(spacing.14))] z-40 border-b border-[var(--border)] bg-[var(--bg)] shadow-lg"
        >
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4">
            {NAV_KEYS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-[var(--fg)] transition-colors hover:bg-[var(--muted)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="my-2 h-px bg-[var(--border)]" aria-hidden />
            <div className="flex items-center justify-center pt-2">
              <GoogleLogin />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}