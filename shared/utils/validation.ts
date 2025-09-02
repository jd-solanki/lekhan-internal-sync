import type { MergeDeep } from 'type-fest'
import type * as z from 'zod'

/**
 * Performs partial validation on a Zod schema, returning only successfully validated fields.
 * Fields that fail validation are omitted from the result.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @param defaults - Optional runtime defaults that match the schema output type
 * @returns An object containing only the successfully validated fields, with defaults applied
 *
 * **Features:**
 * - ✅ Partial validation: Only includes fields that pass validation
 * - ✅ Schema defaults: Automatically applies Zod schema defaults
 * - ✅ Runtime defaults: Override schema defaults with type-safe runtime values
 * - ✅ Type coercion: Supports Zod's type coercion (e.g., string to number)
 * - ✅ Error handling: Gracefully handles validation failures
 * - ✅ Type safety: Full TypeScript support with proper inference
 *
 * **Priority order:**
 * 1. Valid input data (highest priority)
 * 2. Runtime defaults (if data validation fails)
 * 3. Schema defaults (if no runtime default provided)
 * 4. Omit field (if all above fail)
 *
 * @example
 * ```typescript
 * // Basic usage with schema defaults
 * const schema = z.object({
 *   page: z.coerce.number().min(1).default(1),
 *   size: z.coerce.number().min(1).max(100).default(10),
 * })
 *
 * const result1 = partialParse(schema, { page: 2 })
 * // { page: 2, size: 10 } - size gets default value from schema
 *
 * const result2 = partialParse(schema, {})
 * // { page: 1, size: 10 } - both get schema defaults
 * ```
 *
 * @example
 * ```typescript
 * // Using runtime defaults (override schema defaults)
 * const result = partialParse(schema, {}, { page: 5, size: 20 })
 * // { page: 5, size: 20 } - runtime defaults override schema defaults
 * ```
 *
 * @example
 * ```typescript
 * // Handling invalid data with fallbacks
 * const schemaNoDefaults = z.object({
 *   page: z.coerce.number().min(1),
 *   size: z.coerce.number().min(1),
 * })
 *
 * const result = partialParse(schemaNoDefaults, { page: 'invalid' }, { page: 1 })
 * // { page: 1 } - runtime default used because 'invalid' failed validation
 * ```
 */
export function partialParse<T extends z.ZodRawShape, D extends Partial<z.infer<z.ZodObject<T>>>>(
  schema: z.ZodObject<T>,
  data: Record<string, unknown>,
  defaults?: D,
): MergeDeep<Partial<z.infer<z.ZodObject<T>>>, { [x in keyof D]: D[x] }> {
  const result: Record<string, unknown> = {}

  // Get the shape of the schema to iterate over each field
  const shape = schema.shape

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const hasData = key in data
    const value = data[key]

    if (hasData) {
      // Try to validate the provided data
      const parseResult = (fieldSchema as any).safeParse(value)
      if (parseResult.success) {
        result[key] = parseResult.data
        continue
      }
    }

    // Data validation failed or no data provided
    // Check for runtime defaults first (they have priority)
    if (defaults && key in defaults) {
      const defaultValue = (defaults as any)[key]
      const defaultParseResult = (fieldSchema as any).safeParse(defaultValue)
      if (defaultParseResult.success) {
        result[key] = defaultParseResult.data
        continue
      }
    }

    // No valid runtime default, try schema default by parsing undefined
    // This triggers Zod's default value if one exists
    const schemaDefaultResult = (fieldSchema as any).safeParse(undefined)
    if (schemaDefaultResult.success) {
      result[key] = schemaDefaultResult.data
    }
  }

  return result as MergeDeep<Partial<z.infer<z.ZodObject<T>>>, { [x in keyof D]: D[x] }>
}

export function extractDefaultValuesFromSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => [key, value._def.defaultValue]),
  )
}
