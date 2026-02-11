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
      if (userStore.user?.role !== 'admin' && isAdminRoute(route.meta))
        continue

      // Generate a human-readable label from the route path
      // Custom label from meta overrides only the leaf segment, prefix is always path-derived
      const label = generateSearchLabel(route.path, meta.search?.label)

      // Skip routes without meaningful labels (like parent routes without content)
      if (!label)
        continue

      // Get icon from meta or use default
      const icon = meta.search?.icon || 'i-lucide-file'

      if (!meta.search?.icon) {
        console.warn(`[useSearchableRoutes] Route "${route.path}" is missing a search icon in its metadata.`)
      }

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
 * For nested routes, prefix with parent context (e.g., "Account Settings / Profile")
 * If customLabel is provided, it overrides only the leaf segment
 */
function generateSearchLabel(path: string, label?: string): string | null {
  /*
    Remove leading/trailing slashes

    /app => "app"
    /app/billing/ => "app/billing"
  */
  const cleanPath = path.replace(/^\/+|\/+$/g, '')

  // Skip root path only
  if (!cleanPath)
    return null

  /*
    "app/billing" => [ "app", "billing" ]
    "admin/settings" => [ "admin", "settings" ]
  */
  const segments = cleanPath.split('/')

  /*
    Skip the first segment if it's 'app' or 'admin'

    [ "app", "billing" ] => 1
    [ "billing" ] => 0

    [ "app", "billing" ] => [ "billing" ]
    [ "billing" ] => [ "billing" ]
  */
  const startIdx = (segments[0] === 'app' || segments[0] === 'admin') ? 1 : 0
  const meaningfulSegments = segments.slice(startIdx)

  /*
    [ "app" ] => []
    [ "app", "billing" ] => [ "billing" ]
  */
  if (meaningfulSegments.length === 0)
    return label || null

  // For single segment routes, use provided label or auto-generate
  if (meaningfulSegments.length === 1) {
    return label || toTitleCase(meaningfulSegments[0]!)
  }

  /*
    For nested routes, build prefix from all but last segment

    [ "account-settings", "profile" ] => [ "Account Settings" ]
  */
  const prefixSegments = meaningfulSegments.slice(0, -1).map(toTitleCase)
  /*
    [ "account-settings", "profile" ] + label "User Profile" => "User Profile"
    [ "account-settings", "profile" ] + no label => "Profile"
  */
  const leafLabel = label || toTitleCase(meaningfulSegments[meaningfulSegments.length - 1]!)

  /*
    [ "Account Settings", "Profile" ] => "Account Settings / Profile"
  */
  return [...prefixSegments, leafLabel].join(' / ')
}
