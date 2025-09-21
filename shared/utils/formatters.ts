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

// handle camelCase, snake_case, kebab-case, and normal sentences
export function toTitleCase(str: string) {
  if (!str)
    return str

  // Replace underscores and hyphens with spaces
  const withSpaces = str.replace(/[_-]+/g, ' ')

  // Insert space before uppercase letters (for camelCase)
  const withInsertedSpaces = withSpaces.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Capitalize the first letter of each word
  return withInsertedSpaces.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
}
