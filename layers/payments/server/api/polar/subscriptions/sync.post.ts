import { polarClient } from '~~/layers/payments/server/libs/polar'
import { upsertSubscriptionFromPolar } from '~~/layers/payments/server/services/polar/subscription'

export default defineAuthenticatedEventHandler(async (event) => {
  const user = event.context.user
  const userPolarCustomerId = user.polarCustomerId

  // Fetch all subscriptions from Polar for authenticated user
  const response = await polarClient.subscriptions.list({
    customerId: userPolarCustomerId,
  })

  const subscriptions = response.result.items

  const syncedSubscriptions = []

  for (const subscription of subscriptions) {
    const syncedSubscription = await upsertSubscriptionFromPolar(subscription)
    syncedSubscriptions.push(syncedSubscription)
  }

  return {
    syncedSubscriptions,
  }
})
