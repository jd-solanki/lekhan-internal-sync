import * as z from 'zod'
import { syncSubscriptionByPolarSubscriptionId } from '~~/layers/payments/server/utils/polar/utils'

const schemaRouterParams = z.object({
  id: z.uuidv4(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)

  // Fetch latest subscription to sync entitlements immediately after plan change.
  const syncedSubscription = await syncSubscriptionByPolarSubscriptionId(routerParams.id)

  return {
    syncedSubscription,
  }
})
