/* eslint-disable no-console */
import type { PolarWebhookEvent } from '../types'
import { isStaleWebhook, parseProductPayload, upsertProduct } from '~~/layers/payments/server/services/polar/product'

export async function handleProductCreated(event: PolarWebhookEvent): Promise<void> {
  // Parse and transform the raw payload (snake_case → camelCase, string dates → Date)
  const productPayload = await parseProductPayload(event.data, event.type)

  if (!productPayload) {
    console.error(`⏭️  Skipping ${event.type} due to validation failure`)
    return
  }

  // Idempotency check
  if ((await isStaleWebhook(productPayload))) {
    console.log(`⏭️  Skipping stale product webhook: ${productPayload.id}`)
    return
  }

  await upsertProduct(productPayload)
}
