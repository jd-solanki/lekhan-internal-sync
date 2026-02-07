/* eslint-disable no-console */
import type { PolarWebhookEvent } from '../types'
import { isOrderStale, parseOrderPayload, upsertOrderFromPolar } from '~~/layers/payments/server/services/polar/order'

export async function handleOrderEvent(event: PolarWebhookEvent): Promise<void> {
  // Parse and transform the raw payload (snake_case → camelCase, string dates → Date)
  const orderPayload = await parseOrderPayload(event.data, event.type)

  if (!orderPayload) {
    console.error(`⏭️  Skipping ${event.type} due to validation failure`)
    return
  }

  // Idempotency check
  if (await isOrderStale(orderPayload)) {
    console.log(`⏭️  Skipping stale order webhook: ${orderPayload.id}`)
    return
  }

  await upsertOrderFromPolar(orderPayload)
}
