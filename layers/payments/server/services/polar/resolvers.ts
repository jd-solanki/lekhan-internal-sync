import env from '#server/libs/env'
import { eq } from 'drizzle-orm'
import { dbTablePolarProduct, dbTablePolarSubscription, dbTableUser } from '~~/server/db/schemas/tables'
import { syncSubscriptionByPolarSubscriptionId } from '../../utils/polar/utils'

export async function resolveUserIdFromPolarCustomerId(polarCustomerId: string, entityLabel: string): Promise<number | null> {
  const existingUser = await db.query.dbTableUser.findFirst({
    where: eq(dbTableUser.polarCustomerId, polarCustomerId),
  })

  if (existingUser) {
    return existingUser.id
  }

  // INFO: If guest checkouts are allowed, user may not exist yet hence we return null instead of throwing error
  if (!env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY) {
    return null
  }

  throw createError({ status: 400, message: `User not found for ${entityLabel}` })
}

export async function resolveProductId(polarProductId: string | null, entityLabel: string): Promise<number> {
  if (!polarProductId) {
    throw createError({ status: 400, message: `Missing product id for ${entityLabel}` })
  }

  const existingProduct = await db.query.dbTablePolarProduct.findFirst({
    where: eq(dbTablePolarProduct.polarId, polarProductId),
  })

  if (!existingProduct) {
    throw createError({ status: 400, message: `Product not found for ${entityLabel}` })
  }

  return existingProduct.id
}

export async function resolveSubscriptionId(polarSubscriptionId: string | null): Promise<number | null> {
  if (!polarSubscriptionId) {
    return null
  }

  const existingSubscription = await db.query.dbTablePolarSubscription.findFirst({
    where: eq(dbTablePolarSubscription.polarId, polarSubscriptionId),
  })

  // If subscription not found, try to sync it from Polar if we have an event context
  if (!existingSubscription) {
    // If subscription not found, this can be called by orders/sync.post.ts before subscriptions/sync.post.ts
    // User starts subscriptions -> We receive sync order by checkoutId -> subscription may not be created yet in our DB
    const syncedSubscription = await syncSubscriptionByPolarSubscriptionId(polarSubscriptionId)

    return syncedSubscription.id
  }

  return existingSubscription.id
}

/**
 * @deprecated Prefer `resolveUserIdFromPolarCustomerId` for robustness
 * You may not want `resolveUserIdFromExternalId` for robustness because externalId can be null when guest checkouts are allowed
 * Instead prefer `resolveUserIdFromPolarCustomerId` which use polarCustomerId to lookup user
 * And we'll always have polarCustomerId when new user account is create regardless of guest checkout setting
 * We're preserving this function just for reference
 */
export async function resolveUserIdFromExternalId(externalId: string | null, entityLabel: string): Promise<number | null> {
  if (!externalId) {
    /*
      INFO: Only throw error if we expect authenticated users can only create checkouts

      When guest checkouts are allowed, externalId can be null (until user creates an account).
    */
    if (!env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY) {
      return null
    }

    throw createError({ status: 400, message: `Missing customer.externalId for ${entityLabel}` })
  }

  const userId = Number(externalId)

  if (!Number.isInteger(userId)) {
    throw createError({ status: 400, message: `Invalid customer.externalId for ${entityLabel}` })
  }

  // Ensure we only sync data for users that exist locally.
  const existingUser = await db.query.dbTableUser.findFirst({
    where: eq(dbTableUser.id, userId),
  })

  if (!existingUser) {
    throw createError({ status: 400, message: `User not found for ${entityLabel}` })
  }

  return userId
}
