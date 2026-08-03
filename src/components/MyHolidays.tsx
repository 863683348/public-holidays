'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { COUNTRIES, getCountryName } from '@/lib/countries'
import { daysUntil, toISODate } from '@/lib/holiday-dates'
import type { Holiday } from '@/lib/types'

const STORAGE_KEY = 'pubholiday:saved-countries'

interface HolidayRow {
  date: string
  name: string
}

interface CountryView {
  today: HolidayRow[]
  next: HolidayRow | null
  days: number | null
}

function loadSaved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : []
  } catch {
    return []
  }
}

export default function MyHolidays() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [views, setViews] = useState<Record<string, CountryView>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSaved(loadSaved())
  }, [])

  const refresh = useCallback(
    async (codes: string[]) => {
      if (codes.length === 0) {
        setViews({})
        return
      }
      setLoading(true)
      const year = new Date().getFullYear()
      const today = toISODate(new Date())
      const entries = await Promise.all(
        codes.map(async (code) => {
          const [cur, nextYear] = await Promise.all([
            fetch(`/${locale}/api/holidays?country=${code}&year=${year}`)
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null),
            fetch(`/${locale}/api/holidays?country=${code}&year=${year + 1}`)
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null),
          ])
          const holidays: Holiday[] = [
            ...(cur?.holidays ?? []),
            ...(nextYear?.holidays ?? []),
          ].sort((a, b) => a.date.localeCompare(b.date))
          const todayRows = holidays
            .filter((h) => h.date === today)
            .map((h) => ({ date: h.date, name: h.name }))
          const nextHoliday = holidays.find((h) => h.date >= today) ?? null
          return [
            code,
            {
              today: todayRows,
              next: nextHoliday
                ? { date: nextHoliday.date, name: nextHoliday.name }
                : null,
              days: nextHoliday ? daysUntil(nextHoliday.date, today) : null,
            },
          ] as const
        })
      )
      setViews(Object.fromEntries(entries))
      setLoading(false)
    },
    [locale]
  )

  useEffect(() => {
    if (mounted) {
      refresh(saved)
    }
  }, [mounted, saved, refresh])

  const addCountry = (code: string) => {
    if (!code || saved.includes(code)) return
    const next = [...saved, code]
    setSaved(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage unavailable
    }
  }

  const removeCountry = (code: string) => {
    const next = saved.filter((c) => c !== code)
    setSaved(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage unavailable
    }
  }

  const unsaved = useMemo(
    () => COUNTRIES.filter((c) => !saved.includes(c.code)),
    [saved]
  )

  if (!mounted) {
    return <div className="h-40 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)]" aria-hidden />
  }

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{t('myHolidays')}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t('myHolidaysHint')}</p>
        </div>
        <select
          aria-label={t('addCountry')}
          value=""
          onChange={(e) => addCountry(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-brand focus:outline-none"
        >
          <option value="" disabled>
            {t('addCountry')}
          </option>
          {unsaved.map((c) => (
            <option key={c.code} value={c.code}>
              {getCountryName(c.code, locale)}
            </option>
          ))}
        </select>
      </div>

      {saved.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t('emptySaved')}</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {saved.map((code) => {
            const view = views[code]
            const name = getCountryName(code, locale)
            return (
              <li
                key={code}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              >
                <div className="min-w-0">
                  <Link
                    href={`/${code}`}
                    className="block truncate text-sm font-medium transition hover:text-brand"
                  >
                    {name}
                  </Link>
                  {loading && !view ? (
                    <span className="text-xs text-[var(--muted)]">...</span>
                  ) : view?.today.length ? (
                    <span className="text-xs font-medium text-brand">
                      {view.today.map((h) => h.name).join(', ')}
                    </span>
                  ) : view?.next ? (
                    <span className="text-xs text-[var(--muted)]">
                      {view.next.name} · {view.days} {t('days')}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--muted)]">-</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeCountry(code)}
                  className="shrink-0 rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] transition hover:text-[var(--fg)]"
                >
                  {t('remove')}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}