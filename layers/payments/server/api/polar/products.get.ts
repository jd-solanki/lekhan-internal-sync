import { db } from '#server/db'
import { and, count, eq } from 'drizzle-orm'
import * as z from 'zod'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'
import { dbTableProduct } from '~~/layers/payments/server/db/schemas/tables'
import { dbSchemaProductSelect } from '~~/layers/payments/shared/schemas/db'

const querySchema = paginationSchema.extend({
  is_recurring: z.enum(['true', 'false']).optional(),
})

export default defineEventHandler(async (event) => {
  const { page, size, is_recurring } = await getValidatedQuery(event, querySchema.parse)

  // Initialize filters with is_archived = false
  const filters = [eq(dbTableProduct.isArchived, false)]

  // Filter by is_recurring if provided
  if (is_recurring !== undefined) {
    filters.push(eq(dbTableProduct.isRecurring, is_recurring === 'true'))
  }

  const whereClause = filters.length > 1 ? and(...filters) : filters[0]

  const products = await db
    .select()
    .from(dbTableProduct)
    .where(whereClause)
    .limit(size)
    .offset((page - 1) * size)

  const countRows = await db
    .select({ count: count() })
    .from(dbTableProduct)
    .where(whereClause)

  const total = countRows[0]?.count ?? 0

  return {
    products: dbSchemaProductSelect.array().parse(products),
    total,
  }
})
