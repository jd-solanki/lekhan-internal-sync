import { polarClient } from '~~/server/libs/polar'

export default defineEventHandler(() => {
  // TODO: Retrieve polar customer ID from
  // Issue URL: https://github.com/LaunchDayOne/LaunchDayOne/issues/45
  return polarClient.orders.list({
    customerId: 'e457a1e6-b76f-4da4-9704-5b26e085b8ce',
  })
})
