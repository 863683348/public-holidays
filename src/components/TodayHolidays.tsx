'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getCountryName } from '@/lib/countries'
import { daysUntil, toISODate } from '@/lib/holiday-dates'
import type { Holiday } from '@/lib/types'

export interface CountryHolidays {
  code: string
  holidays: Holiday[]
}

export default function TodayHolidays({ countries }: { countries: CountryHolidays[] }) {
  const t = useTranslations('home')
  const locale = useLocale()
  const today = toISODate(new Date())

  const rows = useMemo(() => {
    return countries.map((c) => {
      const sorted = [...c.holidays].sort((a, b) => a.date.localeCompare(b.date))
      const todayHolidays = sorted.filter((h) => h.date === today)
      const next = sorted.find((h) => h.date >= today) ?? null
      return {
        code: c.code,
        name: getCountryName(c.code, locale),
        todayHolidays,
        next,
        days: next ? daysUntil(next.date, today) : null,
      }
    })
  }, [countries, locale, today])

  const onHoliday = rows.filter((r) => r.todayHolidays.length > 0)

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{t('todayHolidays')}</h2>
        <span className="text-xs text-[var(--muted)]">{toISODate(new Date())}</span>
      </div>

      {onHoliday.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {onHoliday.map((r) => (
            <li key={r.code}>
              <Link
                href={`/${r.code}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm transition hover:border-brand"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-right text-xs text-[var(--muted)]">
                  {r.todayHolidays.map((h) => h.name).join(', ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--muted)]">{t('todayNone')}</p>
      )}

      <div className="mt-4 border-t border-[var(--border)] pt-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {t('nextHoliday')}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {rows
            .filter((r) => r.next)
            .slice(0, 8)
            .map((r) => (
              <li key={r.code}>
                <Link
                  href={`/${r.code}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm transition hover:border-brand"
                >
                  <span className="truncate font-medium">{r.name}</span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">
                    {r.next?.name} · {r.days} {t('days')}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}
