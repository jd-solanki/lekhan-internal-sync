import { polarClient } from '~~/layers/payments/server/libs/polar'

export default defineEventHandler(() => {
  return polarClient.products.list({ isArchived: false })
})
