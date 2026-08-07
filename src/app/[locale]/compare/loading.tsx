// Streaming/soft-navigation fallback for /compare (RSC payload in flight).
// Skeleton follows the site's card/border tokens; no spinner, no emoji.
export default function CompareLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading comparison">
      <header className="space-y-3">
        <div className="h-8 w-2/3 animate-pulse rounded bg-[var(--card)]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--card)]" />
      </header>
      <div className="h-16 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)]" />
      <div className="h-12 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)]" />
      <div className="h-10 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)]" />
      <div className="h-64 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)]" />
    </div>
  );
}
