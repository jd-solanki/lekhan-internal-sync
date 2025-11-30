import { polarClient } from '~~/layers/launchdayone-payments/server/libs/polar'

export default defineEventHandler(() => {
  return polarClient.products.list({ isArchived: false })
})
