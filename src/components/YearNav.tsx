import { Link } from "@/i18n/navigation";

const base =
  "inline-flex items-center justify-center min-w-[2.75rem] px-3 py-1.5 rounded-md text-sm font-medium border transition-colors";
const idle =
  "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--brand)]";
const active = "border-[var(--brand)] bg-[var(--brand)] text-white";

export default function YearNav({
  country,
  year,
}: {
  country: string;
  year: number;
}) {
  const window = [year - 1, year, year + 1];

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Year navigation"
    >
      <Link
        href={`/${country}/${year - 1}`}
        className={`${base} ${idle}`}
        aria-label={`Previous year ${year - 1}`}
      >
        &larr;
      </Link>
      {window.map((y) => (
        <Link
          key={y}
          href={`/${country}/${y}`}
          className={`${base} ${y === year ? active : idle}`}
          aria-current={y === year ? "page" : undefined}
        >
          {y}
        </Link>
      ))}
      <Link
        href={`/${country}/${year + 1}`}
        className={`${base} ${idle}`}
        aria-label={`Next year ${year + 1}`}
      >
        &rarr;
      </Link>
    </nav>
  );
}
