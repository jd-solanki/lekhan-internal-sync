import { polarClient } from '~~/server/libs/polar'

export default defineEventHandler(() => {
  return polarClient.customers.getStateExternal({ externalId: '32' })
})
