import { count, eq } from 'drizzle-orm'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'

export default defineAuthenticatedEventHandler(async (event) => {
  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  const subscriptions = await db
    .select()
    .from(dbTablePolarSubscription)
    .where(eq(dbTablePolarSubscription.userId, event.context.user.id))
    .limit(size)
    .offset((page - 1) * size)

  const countRows = await db
    .select({ count: count() })
    .from(dbTablePolarSubscription)
    .where(eq(dbTablePolarSubscription.userId, event.context.user.id))

  const total = countRows[0]?.count ?? 0

  return {
    subscriptions: dbSchemaPolarSubscriptionSelect.array().parse(subscriptions),
    total,
  }
})
