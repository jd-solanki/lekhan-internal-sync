export function formatDateByLocale(locale: string, d: string | number | Date) {
  return new Date(d).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
