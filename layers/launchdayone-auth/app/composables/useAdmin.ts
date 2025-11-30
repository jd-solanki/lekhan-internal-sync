export function useAdmin(options?: { route?: ReturnType<typeof useRoute> }) {
  const { route = useRoute() } = options || {}

  const isAdminOnlyRoute = computed(() => route.meta.isAdminOnly)
  return {
    isAdminOnlyRoute,
  }
}
