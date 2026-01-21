import type { RouteMeta } from 'vue-router'

export function isAdminRoute(routeMeta: RouteMeta): boolean {
  return routeMeta.groups?.includes('admin') ?? false
}

export function useAdmin(options?: { route?: ReturnType<typeof useRoute> }) {
  const { route = useRoute() } = options || {}

  const _isAdminRoute = computed(() => isAdminRoute(route.meta))

  return {
    isAdminRoute: _isAdminRoute,
  }
}
