/* eslint-disable no-console */
import type { Product } from '@polar-sh/sdk/models/components/product'
import { Product$inboundSchema } from '@polar-sh/sdk/models/components/product'
import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { dbTableProduct } from '~~/server/db/schemas/tables'

/**
 * Computes the latest product-related change time.
 * What: include nested models; Why: price/benefit/media updates may not bump product.
 * Moreover, Price change replaces entire price object, so we also need to check createdAt.
 * What: select newest timestamp; Why: stale detection needs max of nested dates.
 */
function getLatestProductChangeAt(payload: {
  modifiedAt?: DateLike
  createdAt?: DateLike
  prices?: unknown
  benefits?: unknown
  medias?: unknown
}): Date | null {
  const rootDate = maxDate([payload.modifiedAt, payload.createdAt])

  // inspect nested models for comparison because product change can occur in nested entities.
  const pricesDate = maxNestedDate(payload.prices, ['modifiedAt', 'createdAt'])
  const benefitsDate = maxNestedDate(payload.benefits, ['modifiedAt', 'createdAt'])
  const mediasDate = maxNestedDate(payload.medias, ['lastModifiedAt', 'createdAt'])

  return maxDate([rootDate, pricesDate, benefitsDate, mediasDate])
}

/**
 * Parses and validates the raw webhook payload using Polar SDK's Zod schema.
 * The SDK schema transforms snake_case to camelCase and string dates to Date objects.
 * Returns the transformed Product or null if validation fails.
 */
export function parseProductPayload(rawData: unknown, eventType: string): Product | null {
  const result = Product$inboundSchema.safeParse(rawData)

  if (!result.success) {
    const errorTitle = `Invalid '${eventType}' Payload Structure`
    console.error(`${errorTitle}:`, result.error)

    const runtimeConfig = useRuntimeConfig()

    // Alert admins - Polar API may have changed
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

/**
 * Checks if incoming webhook is stale (older than existing DB record).
 * Returns true if webhook should be skipped.
 */
export async function isStaleWebhook(productPayload: Product): Promise<boolean> {
  const existingDBProduct = await db.query.dbTableProduct.findFirst({
    where: eq(dbTableProduct.polarId, productPayload.id),
  })

  if (!existingDBProduct) {
    return false
  }

  // NOTE: `productPayload.modifiedAt` can be null when product is created for first time
  // WARNING: Polar sends `product.updated` event even when we first create a product
  //          Hence, we must check against `createdAt` as well to avoid stale updates
  const payloadLatestChangeAt = getLatestProductChangeAt({
    modifiedAt: productPayload.modifiedAt,
    createdAt: productPayload.createdAt,
    prices: productPayload.prices,
    benefits: productPayload.benefits,
    medias: productPayload.medias,
  })

  const existingLatestChangeAt = getLatestProductChangeAt({
    modifiedAt: existingDBProduct.polarModifiedAt,
    createdAt: existingDBProduct.polarCreatedAt,
    prices: existingDBProduct.prices,
    benefits: existingDBProduct.benefits,
    medias: existingDBProduct.medias,
  })

  if (!payloadLatestChangeAt || !existingLatestChangeAt) {
    return false
  }

  return existingLatestChangeAt.getTime() >= payloadLatestChangeAt.getTime()
}

/**
 * Upserts a product from Polar webhook payload.
 */
export async function upsertProduct(productPayload: Product): Promise<void> {
  // What: isolate mutable fields; Why: avoid overwriting immutable product identifiers.
  const updateFields = {
    polarModifiedAt: productPayload.modifiedAt,
    name: productPayload.name,
    description: productPayload.description,
    isRecurring: productPayload.isRecurring,
    isArchived: productPayload.isArchived,
    metadata: productPayload.metadata || {},
    trialInterval: productPayload.trialInterval,
    trialIntervalCount: productPayload.trialIntervalCount,
    recurringInterval: productPayload.recurringInterval,
    recurringIntervalCount: productPayload.recurringIntervalCount,
    benefits: productPayload.benefits || [],
    medias: productPayload.medias || [],
    prices: productPayload.prices || [],
  }

  const [product] = await db
    .insert(dbTableProduct)
    .values({
      ...updateFields,
      polarId: productPayload.id,
      polarCreatedAt: productPayload.createdAt,
      organizationId: productPayload.organizationId,
    })
    .onConflictDoUpdate({
      target: dbTableProduct.polarId,
      set: updateFields,
    })
    .returning()

  if (!product) {
    throw new Error(`Failed to upsert product: ${productPayload.id}`)
  }

  console.log(`✅ Product upserted: ${productPayload.id} (${productPayload.name})`)
}
