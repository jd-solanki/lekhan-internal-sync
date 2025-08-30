// Polar Docs: https://docs.polar.sh/api-reference/orders/patch
import { z } from 'zod/v4'
import { polarClient } from '~~/server/libs/polar'

const routerParamsSchema = z.object({
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, routerParamsSchema.parse)
  const body = await readValidatedBody(event, schemaPolarOrderBillingUpdate.parse)

  // Use the polar client to update billing details
  const response = await polarClient.orders.update({
    id: routerParams.id,
    orderUpdate: body,
  })

  return response
})
