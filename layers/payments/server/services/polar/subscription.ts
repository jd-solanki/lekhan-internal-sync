/* eslint-disable no-console */
import type { Subscription } from '@polar-sh/sdk/models/components/subscription'
import type { DBSSubscriptionSelect } from '~~/layers/payments/shared/schemas/db'
import { Subscription$inboundSchema } from '@polar-sh/sdk/models/components/subscription'
import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { dbTableSubscription } from '~~/server/db/schemas/tables'
import { resolveProductId, resolveUserIdFromExternalId } from './resolvers'

export function parseSubscriptionPayload(rawData: unknown, eventType: string): Subscription | null {
  const result = Subscription$inboundSchema.safeParse(rawData)

  // If parsing fails, it probably means Polar changed the payload structure and we need to update our SDK or webhook handler.
  if (!result.success) {
    const errorTitle = `Invalid '${eventType}' Payload Structure`
    console.error(`${errorTitle}:`, result.error)

    const runtimeConfig = useRuntimeConfig()

    sendEmailToAdmins({
      subject: `[${runtimeConfig.public.app.name}] ${errorTitle}`,
      text: JSON.stringify({
        error: result.error,
        payload: rawData,
      }, null, 2),
    })

    return null
  }

  console.log(`'${eventType}' payload structure validated successfully`)
  return result.data
}

export async function isSubscriptionStale(subscriptionPayload: Subscription): Promise<boolean> {
  const existingSubscription = await db.query.dbTableSubscription.findFirst({
    where: eq(dbTableSubscription.polarId, subscriptionPayload.id),
  })

  if (!existingSubscription) {
    return false
  }

  const payloadModifiedAt = subscriptionPayload.modifiedAt || subscriptionPayload.createdAt
  const existingModifiedAt = existingSubscription.polarModifiedAt || existingSubscription.polarCreatedAt

  return existingModifiedAt >= payloadModifiedAt
}

export async function upsertSubscriptionFromPolar(subscriptionPayload: Subscription): Promise<DBSSubscriptionSelect> {
  const subscriptionLabel = `subscription ${subscriptionPayload.id}`
  const userId = await resolveUserIdFromExternalId(subscriptionPayload.customer.externalId, subscriptionLabel)
  const productId = await resolveProductId(subscriptionPayload.productId, subscriptionLabel)

  // What: isolate mutable fields; Why: avoid overwriting immutable IDs/timestamps.
  const updateFields = {
    polarModifiedAt: subscriptionPayload.modifiedAt,
    status: subscriptionPayload.status,
    amount: subscriptionPayload.amount,
    currency: subscriptionPayload.currency,
    recurringInterval: subscriptionPayload.recurringInterval,
    recurringIntervalCount: subscriptionPayload.recurringIntervalCount,
    currentPeriodStart: subscriptionPayload.currentPeriodStart,
    currentPeriodEnd: subscriptionPayload.currentPeriodEnd,
    trialStart: subscriptionPayload.trialStart,
    trialEnd: subscriptionPayload.trialEnd,
    startedAt: subscriptionPayload.startedAt,
    endsAt: subscriptionPayload.endsAt,
    endedAt: subscriptionPayload.endedAt,
    cancelAtPeriodEnd: subscriptionPayload.cancelAtPeriodEnd,
    canceledAt: subscriptionPayload.canceledAt,
    customerCancellationReason: subscriptionPayload.customerCancellationReason,
    customerCancellationComment: subscriptionPayload.customerCancellationComment,
    seats: subscriptionPayload.seats ?? null,
    prices: subscriptionPayload.prices || [],
    meters: subscriptionPayload.meters || [],
    discount: subscriptionPayload.discount,
    metadata: subscriptionPayload.metadata || {},
    customFieldData: subscriptionPayload.customFieldData || null,
  }

  const [subscription] = await db
    .insert(dbTableSubscription)
    .values({
      ...updateFields,
      polarId: subscriptionPayload.id,
      polarCreatedAt: subscriptionPayload.createdAt,
      userId,
      productId,
      polarCustomerId: subscriptionPayload.customerId,
      polarProductId: subscriptionPayload.productId,
      polarDiscountId: subscriptionPayload.discountId,
      polarCheckoutId: subscriptionPayload.checkoutId,
    })
    .onConflictDoUpdate({
      target: dbTableSubscription.polarId,
      set: updateFields,
    })
    .returning()

  if (!subscription) {
    throw new Error(`Failed to upsert subscription: ${subscriptionPayload.id}`)
  }

  console.log(`✅ Subscription upserted: ${subscriptionPayload.id}`)
  return subscription
}
