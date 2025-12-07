import * as z from 'zod'
import { polarClient } from '~~/layers/payments/server/libs/polar'

const schemaRouterParams = z.object({
  id: z.uuidv4(),
})

const schemaBody = z.object({
  productId: z.uuidv4(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)
  const body = await readValidatedBody(event, schemaBody.parse)

  await polarClient.subscriptions.update({ id: routerParams.id, subscriptionUpdate: { productId: body.productId } })
})
