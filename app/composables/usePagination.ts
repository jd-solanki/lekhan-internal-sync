export function usePagination(options?: { page?: number, size?: number, route: ReturnType<typeof useRoute> }) {
  // Get pagination state from URL query parameters
  const paginationQuery = useParsedQuery(paginationSchema, {
    page: options?.page ?? 1,
    size: options?.size ?? 10,
  }, { route: options?.route })

  // Separate computed for page to work with UPagination component
  const currentPage = computed({
    get: () => paginationQuery.value.page,
    set: (value) => {
      navigateTo({
        query: {
          ...useRoute().query,
          page: value,
          size: paginationQuery.value.size,
        },
      })
    },
  })

  // Separate computed for page size to work with USelect component
  const pageSize = computed({
    get: () => paginationQuery.value.size,
    set: (value) => {
      navigateTo({
        query: {
          ...useRoute().query,
          page: 1, // Reset to first page when changing page size
          size: value,
        },
      })
    },
  })

  return {
    currentPage,
    pageSize,
  }
}
