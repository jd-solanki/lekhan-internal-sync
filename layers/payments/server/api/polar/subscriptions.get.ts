import { count, eq } from 'drizzle-orm'
import { paginationSchema } from '~~/layers/01.base/shared/schemas/pagination'
import { dbTableSubscription } from '~~/layers/payments/server/db/schemas/tables'
import { dbSchemaSubscriptionSelect } from '~~/layers/payments/shared/schemas/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  const subscriptions = await db
    .select()
    .from(dbTableSubscription)
    .where(eq(dbTableSubscription.userId, event.context.user.id))
    .limit(size)
    .offset((page - 1) * size)

  const countRows = await db
    .select({ count: count() })
    .from(dbTableSubscription)
    .where(eq(dbTableSubscription.userId, event.context.user.id))

  const total = countRows[0]?.count ?? 0

  return {
    subscriptions: dbSchemaSubscriptionSelect.array().parse(subscriptions),
    total,
  }
})
