import { polarClient } from '~~/server/libs/polar'

export default defineEventHandler(() => {
  return polarClient.products.list({ isArchived: false })
})
