import { polarClient } from '~~/layers/launchdayone-payments/server/libs/polar'
import * as z from 'zod'

const schemaRouterParams = z.object({
  id: z.uuidv4(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)

  await polarClient.subscriptions.revoke({ id: routerParams.id })
})
