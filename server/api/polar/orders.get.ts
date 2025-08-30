import { polarClient } from '~~/server/libs/polar'
import { paginationSchema } from '~~/shared/schemas/pagination'

export default defineAuthenticatedEventHandler(async (event) => {
  const polarCustomerState = await getPolarCustomerState(event.context.user.id)

  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  const result = await polarClient.orders.list({
    customerId: polarCustomerState.id,
    page,
    limit: size,
  })

  return result
})
