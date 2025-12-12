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

export function decodeSortingQuery(query: string | undefined | null, options?: { validKeys: string[], default: { id: string, desc: boolean }[] }): { id: string, desc: boolean }[] {
  const { validKeys = [], default: defaultVal = [] } = options || {}
  // Query format: "name,-createdAt"

  if (!query || !query.trim())
    return defaultVal

  const parts = query.split(',').map(part => part.trim())

  const validSorting: { id: string, desc: boolean }[] = []
  parts.forEach((part) => {
    // if (part.startsWith('-')) {
    //   return { id: part.substring(1), desc: true }
    // }

    // return { id: part, desc: false }

    const isDesc = part.startsWith('-')
    const key = isDesc ? part.substring(1) : part

    // If validKeys is provided, filter out invalid keys
    if (validKeys.length > 0 && !validKeys.includes(key))
      return

    validSorting.push({ id: key, desc: isDesc })
  })

  return validSorting.length ? validSorting : defaultVal
}

export function encodeSortingQuery(sorting: { id: string, desc: boolean }[]): string {
  // Convert back to query format: "name,-createdAt"
  return sorting.map(({ id, desc }) => (desc ? `-${id}` : id)).join(',')
}
