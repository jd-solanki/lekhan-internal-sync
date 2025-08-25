import type * as z from 'zod'

export function useParsedQuery<T extends z.ZodType>(zodSchema: T, defaults: Partial<z.infer<T>>, options?: { route?: ReturnType<typeof useRoute> }) {
  const { route = useRoute() } = options || {}

  return computed(() => {
    const parsed = zodSchema.safeParse(route.query)
    return parsed.success ? parsed.data : defaults
  })
}
