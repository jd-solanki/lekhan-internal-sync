// Polar Docs: https://docs.polar.sh/api-reference/orders/get-invoice
import * as z from 'zod'
import { polarClient } from '~~/server/libs/polar'

const routerParamsSchema = z.object({
  id: z.uuidv4(),
})

export default defineEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, routerParamsSchema.parse)

  return await polarClient.orders.invoice({ id: routerParams.id })
})
