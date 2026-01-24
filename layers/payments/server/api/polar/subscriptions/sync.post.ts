import * as z from 'zod'
import { polarClient } from '~~/layers/payments/server/libs/polar'
import { upsertSubscriptionFromPolar } from '~~/layers/payments/server/services/polar/subscription'

const schemaBody = z.object({
  polarSubscriptionId: z.string().min(1),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readValidatedBody(event, schemaBody.parse)
  const user = event.context.user

  // Fetch latest subscription to sync entitlements immediately after plan change.
  const subscription = await polarClient.subscriptions.get({
    id: body.polarSubscriptionId,
  })

  if (subscription.customer.externalId !== String(user.id)) {
    throw createError({ status: 403, message: 'Subscription does not belong to this user.' })
  }

  const syncedSubscription = await upsertSubscriptionFromPolar(subscription)

  return {
    subscription: syncedSubscription,
  }
})
