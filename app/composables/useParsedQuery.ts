import type * as z from 'zod'
import { isDeepEqual } from '@antfu/utils'
import { partialParse } from '../../shared/utils/validation'

/**
 * A composable that parses and validates route query parameters using a Zod schema.
 * Returns a computed ref that automatically updates when the route changes.
 *
 * We have used ref instead computed here intentionally to get more control over how side effects are triggered.
 * When using computed, we have to update whole reactive value `parsedQuery.value = { ...parsedQuery.value, page: 1 }` which was triggering unwanted watchers.
 * To overcome this, we use a ref where deep watch reactive value and user don't have to entirely update it. `parsedQuery.value.page = 1`
 *
 *
 * @example
 * ```typescript
 * const paginationSchema = z.object({
 *   page: z.coerce.number().min(1).default(1),
 *   size: z.coerce.number().min(1).max(100).default(10),
 * })
 *
 * const query = useParsedQuery(paginationSchema, { size: 20 })
 * // Reactive query object that updates with route changes
 * ```
 */
export function useParsedQuery<T extends z.ZodRawShape, D extends Partial<z.infer<z.ZodObject<T>>>>(
  zodSchema: z.ZodObject<T>,
  defaults?: D,
  options?: { route?: ReturnType<typeof useRoute> },
) {
  const { route = useRoute() } = options || {}

  // Extract default values from schema's `.default()`
  const schemaDefaults = extractDefaultValuesFromSchema(zodSchema)
  const queryDefaults = { ...schemaDefaults, ...defaults }

  const value = ref(partialParse(zodSchema, route.query, queryDefaults))

  watch(() => route.query, (newValue) => {
    const parsedValue = partialParse(zodSchema, newValue, queryDefaults)

    // Iterate and exclude if query value is equal to default value via filter
    // const filteredQueries = Object.fromEntries(
    //   Object.entries(parsedValue).filter(([key, value]) => value !== queryDefaults[key]),
    // )

    if (!isDeepEqual(value.value, parsedValue)) {
      value.value = parsedValue
    }
  })

  watch(value, async (newValue) => {
    const newQueries = partialParse(zodSchema, newValue)

    // Iterate and exclude if query value is equal to default value via filter
    const filteredQueries = Object.fromEntries(
      Object.entries(newQueries).filter(([key, value]) => value !== queryDefaults[key]),
    )

    await navigateTo({ query: filteredQueries })
  }, { deep: true })

  return value
}
