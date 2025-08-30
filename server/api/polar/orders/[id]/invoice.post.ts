// Docs: https://api.polar.sh/v1/orders/{id}/invoice
import * as z from 'zod'
import { polarClient } from '~~/server/libs/polar'

const routerParamsSchema = z.object({
  id: z.uuidv4(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, routerParamsSchema.parse)

  // Polar will generate invoice in background and trigger the `order.updated` webhook
  return await polarClient.orders.generateInvoice({ id: routerParams.id })
})
