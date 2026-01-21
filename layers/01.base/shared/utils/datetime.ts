export type DateLike = Date | string | number | null | undefined

export function formatDateByLocale(locale: string, d: string | number | Date) {
  return new Date(d).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function normalizeDate(value: DateLike): Date | null {
  if (!value)
    return null

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Gets the latest date from a list of date-like values.
 */
export function maxDate(dates: DateLike[]): Date | null {
  let latest: Date | null = null

  for (const date of dates) {
    const normalized = normalizeDate(date)
    if (!normalized) {
      continue
    }

    if (!latest || normalized.getTime() > latest.getTime()) {
      latest = normalized
    }
  }

  return latest
}

// Extracts the latest nested timestamp from a list by keys.
export function maxNestedDate(items: unknown, keys: string[]): Date | null {
  if (!Array.isArray(items)) {
    return null
  }

  const candidates: DateLike[] = []

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue
    }

    const record = item as Record<string, DateLike>

    for (const key of keys) {
      candidates.push(record[key])
    }
  }

  return maxDate(candidates)
}
