import { and, count, eq } from 'drizzle-orm'
import * as z from 'zod'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'

const querySchema = paginationSchema.extend({
  is_recurring: z.enum(['true', 'false']).optional(),
})

export default defineEventHandler(async (event) => {
  const { page, size, is_recurring } = await getValidatedQuery(event, querySchema.parse)

  // Initialize filters with is_archived = false
  const filters = [eq(dbTablePolarProduct.isArchived, false)]

  // Filter by is_recurring if provided
  if (is_recurring !== undefined) {
    filters.push(eq(dbTablePolarProduct.isRecurring, is_recurring === 'true'))
  }

  const whereClause = filters.length > 1 ? and(...filters) : filters[0]

  const products = await db
    .select()
    .from(dbTablePolarProduct)
    .where(whereClause)
    .limit(size)
    .offset((page - 1) * size)

  const countRows = await db
    .select({ count: count() })
    .from(dbTablePolarProduct)
    .where(whereClause)

  const total = countRows[0]?.count ?? 0

  return {
    products: dbSchemaPolarProductSelect.array().parse(products),
    total,
  }
})
