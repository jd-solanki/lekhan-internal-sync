import { eq } from 'drizzle-orm'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'
import { dbTablePolarOrder } from '~~/server/db/schemas/tables'

// INFO: Return paginated orders with customer data for each order's userId
export default defineAuthenticatedEventHandler(async (event) => {
  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  // Admins can see all orders, regular users only their own
  const whereClause = event.context.user.role === 'admin'
    ? undefined
    : eq(dbTablePolarOrder.userId, event.context.user.id)

  const [orders, totalResult] = await Promise.all([
    db.query.dbTablePolarOrder.findMany({
      where: whereClause,
      with: {
        user: true,
      },
      limit: size,
      offset: (page - 1) * size,
    }),
    db.$count(dbTablePolarOrder, whereClause),
  ])

  return {
    orders,
    total: totalResult,
  }
})
