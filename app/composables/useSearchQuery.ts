import { refDebounced } from '@vueuse/core'

export function useSearchQuery(options?: { debounceDuration: number, route: ReturnType<typeof useRoute> }) {
  const { route = useRoute(), debounceDuration = 300 } = options || {}

  const q = computed({
    get: () => getFirstQueryValue('q', { route }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          q: value || undefined,
        },
      })
    },
  })

  const qDebounced = refDebounced(q, debounceDuration)

  return {
    q,
    qDebounced,
  }
}
