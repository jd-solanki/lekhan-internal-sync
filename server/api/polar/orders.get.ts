import { polarClient } from '~~/server/libs/polar'
import { paginationSchema } from '~~/shared/schemas/pagination'

export default defineEventHandler(async (event) => {
  // TODO: Retrieve polar customer ID from
  // Issue URL: https://github.com/LaunchDayOne/LaunchDayOne/issues/45

  const { page, size } = await getValidatedQuery(event, paginationSchema.parse)

  const result = await polarClient.orders.list({
    customerId: 'e457a1e6-b76f-4da4-9704-5b26e085b8ce',
    page,
    limit: size,
  })

  return result
})
