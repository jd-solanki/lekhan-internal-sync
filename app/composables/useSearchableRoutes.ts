import type { CommandPaletteItem } from '@nuxt/ui'

/**
 * Composable to scan app routes and generate searchable items for command palette
 * Filters routes based on metadata and user permissions
 * Only includes routes using the default layout
 */
export function useSearchableRoutes() {
  const router = useRouter()
  const userStore = useUserStore()

  return computed(() => {
    const routes = router.getRoutes()
    const searchableRoutes: CommandPaletteItem[] = []

    for (const route of routes) {
      // Skip routes without a path or name
      if (!route.path || !route.name)
        continue

      // Skip dynamic routes (containing :)
      if (route.path.includes(':'))
        continue

      const meta = route.meta || {}

      // Only include routes using the default layout
      // Routes without explicit layout use default, routes with layout: 'blank' are excluded
      if (meta.layout && meta.layout !== 'default')
        continue

      // Skip if explicitly hidden from search via search: false
      if (meta.search === false)
        continue

      // Skip admin routes for non-admin users
      if (meta.isAdminOnly === true && userStore.user?.role !== 'admin')
        continue

      // Generate a human-readable label from the route path
      const label = meta.search?.label || generateLabelFromPath(route.path)

      // Skip routes without meaningful labels (like parent routes without content)
      if (!label)
        continue

      // Get icon from meta or use default
      const icon = meta.search?.icon || 'i-lucide-file'

      searchableRoutes.push({
        label,
        icon,
        to: route.path,
        active: false,
      })
    }

    return searchableRoutes.toSorted((a, b) => (a.label || '').localeCompare(b.label || ''))
  })
}

/**
 * Generate a human-readable label from a route path
 * For nested routes, prefix with parent route (e.g., "Account Settings / Profile")
 */
function generateLabelFromPath(path: string): string {
  // Remove leading/trailing slashes
  const cleanPath = path.replace(/^\/+|\/+$/g, '')

  // Skip root path and paths that are too generic
  if (!cleanPath || cleanPath === 'app')
    return ''

  // Split by slashes and get the segments
  const segments = cleanPath.split('/')

  // Skip the first segment if it's 'app' or 'admin'
  const startIdx = (segments[0] === 'app' || segments[0] === 'admin') ? 1 : 0
  const meaningfulSegments = segments.slice(startIdx)

  // Skip if no meaningful segments
  if (meaningfulSegments.length === 0)
    return ''

  // Convert each segment to title case
  const labelSegments = meaningfulSegments.map(segment =>
    segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '))

  // For nested routes (more than 1 segment), join with " / "
  // For single routes, just return the label
  return labelSegments.join(' / ')
}
