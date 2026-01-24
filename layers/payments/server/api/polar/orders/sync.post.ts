import * as z from 'zod'
import { polarClient } from '~~/layers/payments/server/libs/polar'
import { upsertOrderFromPolar } from '~~/layers/payments/server/services/polar/order'

const schemaBody = z.object({
  checkoutId: z.string().min(1),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readValidatedBody(event, schemaBody.parse)
  const user = event.context.user

  // Fetch the order directly from Polar so we can refresh entitlements immediately.
  const response = await polarClient.orders.list({
    checkoutId: body.checkoutId,
    limit: 1,
  })

  const order = response.result.items?.[0]

  if (!order) {
    throw createError({ status: 404, message: 'Order not found for checkout.' })
  }

  if (order.customer.externalId !== String(user.id)) {
    throw createError({ status: 403, message: 'Order does not belong to this user.' })
  }

  const syncedOrder = await upsertOrderFromPolar(order, event)

  return {
    order: syncedOrder,
    hasSubscription: Boolean(syncedOrder.polarSubscriptionId),
  }
})
