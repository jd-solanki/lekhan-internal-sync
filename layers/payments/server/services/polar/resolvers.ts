import type { H3Event } from 'h3'

import { eq } from 'drizzle-orm'

export async function resolveUserIdFromExternalId(externalId: string | null, entityLabel: string): Promise<number> {
  if (!externalId) {
    throw new Error(`Missing customer.externalId for ${entityLabel}`)
  }

  const userId = Number(externalId)

  if (!Number.isInteger(userId)) {
    throw new TypeError(`Invalid customer.externalId for ${entityLabel}`)
  }

  // Ensure we only sync data for users that exist locally.
  const existingUser = await db.query.dbTableUser.findFirst({
    where: eq(dbTableUser.id, userId),
  })

  if (!existingUser) {
    throw new Error(`User not found for ${entityLabel}`)
  }

  return userId
}

export async function resolveProductId(polarProductId: string | null, entityLabel: string): Promise<number> {
  if (!polarProductId) {
    throw new Error(`Missing product id for ${entityLabel}`)
  }

  const existingProduct = await db.query.dbTablePolarProduct.findFirst({
    where: eq(dbTablePolarProduct.polarId, polarProductId),
  })

  if (!existingProduct) {
    throw new Error(`Product not found for ${entityLabel}`)
  }

  return existingProduct.id
}

export async function resolveSubscriptionId(polarSubscriptionId: string | null, entityLabel: string, event?: H3Event): Promise<number | null> {
  if (!polarSubscriptionId) {
    return null
  }

  const existingSubscription = await db.query.dbTablePolarSubscription.findFirst({
    where: eq(dbTablePolarSubscription.polarId, polarSubscriptionId),
  })

  // If subscription not found, try to sync it from Polar if we have an event context
  if (!existingSubscription) {
    if (event) {
      // If subscription not found, this can be called by orders/sync.post.ts before subscriptions/sync.post.ts
      // User starts subscriptions -> We receive sync order by checkoutId -> subscription may not be created yet in our DB
      const dbSubscription = await event.$fetch('/api/polar/subscriptions/sync', {
        method: 'POST',
        body: {
          polarSubscriptionId,
        },
      })
      return dbSubscription.subscription.id
    }

    throw new Error(`Subscription not found for ${entityLabel}`)
  }

  return existingSubscription.id
}
