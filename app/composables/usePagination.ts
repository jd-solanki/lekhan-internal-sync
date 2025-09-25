export function usePagination(options?: { defaultPage?: number, defaultSize?: number, route: ReturnType<typeof useRoute> }) {
  const { route = useRoute(), defaultPage = 1, defaultSize = 10 } = options || {}
  // Get pagination state from URL query parameters
  const paginationQuery = useParsedQuery(paginationSchema, { page: defaultPage, size: defaultSize }, { route })

  // Separate computed for page to work with UPagination component
  const page = computed({
    get: () => paginationQuery.value.page,
    set: async (value) => {
      await navigateTo({
        query: {
          ...route.query,
          page: value === defaultPage ? undefined : value,
          size: paginationQuery.value.size,
        },
      })
    },
  })

  // Separate computed for page size to work with USelect component
  const pageSize = computed({
    get: () => paginationQuery.value.size,
    set: async (value) => {
      await navigateTo({
        query: {
          ...route.query,
          page: undefined, // Reset to first page when changing page size
          size: value === defaultSize ? undefined : value,
        },
      })
    },
  })

  return {
    page,
    pageSize,
  }
}
