import { db } from '#server/db'
import { count, eq } from 'drizzle-orm'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'
import { dbTableOrder } from '~~/layers/payments/server/db/schemas/tables'
import { dbSchemaOrderSelect } from '~~/layers/payments/shared/schemas/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  // Admins can see all orders, regular users only their own
  const whereClause = event.context.user.role === 'admin' ? undefined : eq(dbTableOrder.userId, event.context.user.id)

  const orders = await db
    .select()
    .from(dbTableOrder)
    .where(whereClause)
    .limit(size)
    .offset((page - 1) * size)

  const countRows = await db
    .select({ count: count() })
    .from(dbTableOrder)
    .where(whereClause)

  const total = countRows[0]?.count ?? 0

  return {
    orders: dbSchemaOrderSelect.array().parse(orders),
    total,
  }
})
