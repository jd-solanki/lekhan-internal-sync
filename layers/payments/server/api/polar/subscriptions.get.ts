import { eq } from 'drizzle-orm'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'
import { dbTablePolarSubscription } from '~~/server/db/schemas/tables'

export default defineAuthenticatedEventHandler(async (event) => {
  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  const whereClause = eq(dbTablePolarSubscription.userId, event.context.user.id)

  const [subscriptions, totalResult] = await Promise.all([
    db.query.dbTablePolarSubscription.findMany({
      where: whereClause,
      limit: size,
      offset: (page - 1) * size,
    }),
    db.$count(dbTablePolarSubscription, whereClause),
  ])

  return {
    subscriptions,
    total: totalResult,
  }
})
