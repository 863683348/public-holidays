import type { ReactNode } from "react";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold text-[var(--fg)]">{title}</h1>
      <div className="space-y-6 text-sm leading-relaxed text-[var(--muted)]">
        {children}
      </div>
    </article>
  );
}
