import type * as z from 'zod'
import { partialParse } from '../../shared/utils/validation'

/**
 * A composable that parses and validates route query parameters using a Zod schema.
 * Returns a computed ref that automatically updates when the route changes.
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

  return computed(() => {
    return partialParse(zodSchema, route.query, defaults)
  })
}
