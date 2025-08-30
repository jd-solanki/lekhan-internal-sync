import * as z from 'zod'
import { polarClient } from '~~/server/libs/polar'

const schemaRouterParams = z.object({
  id: z.uuidv4(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)

  await polarClient.subscriptions.revoke({ id: routerParams.id })
})
