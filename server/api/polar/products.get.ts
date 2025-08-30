import { polarClient } from '~~/server/libs/polar'

export default defineAuthenticatedEventHandler(() => {
  return polarClient.products.list({ isArchived: false })
})
