/* eslint-disable no-console */
import type { PolarWebhookEvent } from '~~/layers/payments/server/utils/polar/types'
import { handleCustomerCreated } from '~~/layers/payments/server/utils/polar/webhookHandlers/customer'
import { handleOrderEvent } from '~~/layers/payments/server/utils/polar/webhookHandlers/order'
import { handleProductCreated } from '~~/layers/payments/server/utils/polar/webhookHandlers/product'
import { handleSubscriptionEvent } from '~~/layers/payments/server/utils/polar/webhookHandlers/subscription'

type PolarEventHandler = (event: PolarWebhookEvent) => Promise<void>

const handlers: Record<string, PolarEventHandler> = {
  'customer.created': handleCustomerCreated,
  'product.created': handleProductCreated,
  'product.updated': handleProductCreated,
  'subscription.created': handleSubscriptionEvent,
  'subscription.active': handleSubscriptionEvent,
  'subscription.updated': handleSubscriptionEvent,
  'subscription.canceled': handleSubscriptionEvent,
  'subscription.uncanceled': handleSubscriptionEvent,
  'subscription.revoked': handleSubscriptionEvent,
  'order.created': handleOrderEvent,
  'order.paid': handleOrderEvent,
  'order.updated': handleOrderEvent,
  'order.refunded': handleOrderEvent,
}

export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidPolarWebhook(event)

  if (!isValidWebhook) {
    throw createError({ status: 401, message: 'Unauthorized: webhook is not valid' })
  }

  const webhookEvent: PolarWebhookEvent = await readBody(event)
  console.log(`Received event [${webhookEvent.type}]:\n${JSON.stringify(webhookEvent, null, 4)}\n\n`)

  const eventType = webhookEvent.type

  try {
    // Route to handlers based on event type
    const handler = handlers[eventType]
    if (handler) {
      await handler(webhookEvent)
    }
    else {
      console.log(`No handler for event type: ${eventType}`)
    }

    console.log(`Webhook ${eventType} processed successfully`)
  }
  catch (error) {
    console.error(`Error processing webhook ${webhookEvent.type}:`, error)
    if (error instanceof Error && error.stack) {
      console.error(`Stack trace: ${error.stack}`)
    }
    // Don't throw - webhooks are fire-and-forget
  }
})
