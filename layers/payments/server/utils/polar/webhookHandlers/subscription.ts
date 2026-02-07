/* eslint-disable no-console */
import type { PolarWebhookEvent } from '../types'
import { isSubscriptionStale, parseSubscriptionPayload, upsertSubscriptionFromPolar } from '~~/layers/payments/server/services/polar/subscription'

export async function handleSubscriptionEvent(event: PolarWebhookEvent): Promise<void> {
  const subscriptionPayload = await parseSubscriptionPayload(event.data, event.type)

  if (!subscriptionPayload) {
    console.error(`Skipping ${event.type} due to validation failure`)
    return
  }

  if (await isSubscriptionStale(subscriptionPayload)) {
    console.log(`⏭️  Skipping stale subscription webhook: ${subscriptionPayload.id}`)
    return
  }

  await upsertSubscriptionFromPolar(subscriptionPayload)
}
