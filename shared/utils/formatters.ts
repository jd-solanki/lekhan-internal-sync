export const formatPolarAmount = (amount: number) => `$${((amount || 0) / 100).toFixed(2)}`

export function getInitials(name?: string) {
  if (!name)
    return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
}
