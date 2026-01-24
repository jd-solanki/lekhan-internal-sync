/* eslint-disable no-console */
import type { Order } from '@polar-sh/sdk/models/components/order'
import type { H3Event } from 'h3'
import type { DBOrderSelect } from '~~/layers/payments/shared/schemas/db'

import { dbTableOrder } from '#server/db/schemas/tables'
import { Order$inboundSchema } from '@polar-sh/sdk/models/components/order'
import { eq } from 'drizzle-orm'
import { resolveProductId, resolveSubscriptionId, resolveUserIdFromExternalId } from './resolvers'

export function parseOrderPayload(rawData: unknown, eventType: string): Order | null {
  const result = Order$inboundSchema.safeParse(rawData)

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

export async function isOrderStale(orderPayload: Order): Promise<boolean> {
  const existingOrder = await db.query.dbTableOrder.findFirst({
    where: eq(dbTableOrder.polarId, orderPayload.id),
  })

  if (!existingOrder) {
    return false
  }

  const payloadModifiedAt = orderPayload.modifiedAt || orderPayload.createdAt
  const existingModifiedAt = existingOrder.polarModifiedAt || existingOrder.polarCreatedAt

  return existingModifiedAt >= payloadModifiedAt
}

export async function upsertOrderFromPolar(orderPayload: Order, event?: H3Event): Promise<DBOrderSelect> {
  const orderLabel = `order ${orderPayload.id}`
  const userId = await resolveUserIdFromExternalId(orderPayload.customer.externalId, orderLabel)
  const [productId, subscriptionId] = await Promise.all([
    resolveProductId(orderPayload.productId, orderLabel),
    resolveSubscriptionId(orderPayload.subscriptionId, orderLabel, event),
  ])

  // What: isolate mutable fields; Why: avoid overwriting immutable IDs/timestamps.
  const updateFields = {
    polarModifiedAt: orderPayload.modifiedAt,
    status: orderPayload.status,
    paid: orderPayload.paid,
    billingReason: orderPayload.billingReason,
    subtotalAmount: orderPayload.subtotalAmount,
    discountAmount: orderPayload.discountAmount,
    netAmount: orderPayload.netAmount,
    taxAmount: orderPayload.taxAmount,
    totalAmount: orderPayload.totalAmount,
    appliedBalanceAmount: orderPayload.appliedBalanceAmount,
    dueAmount: orderPayload.dueAmount,
    refundedAmount: orderPayload.refundedAmount,
    refundedTaxAmount: orderPayload.refundedTaxAmount,
    platformFeeAmount: orderPayload.platformFeeAmount,
    currency: orderPayload.currency,
    billingName: orderPayload.billingName,
    billingAddress: orderPayload.billingAddress,
    invoiceNumber: orderPayload.invoiceNumber,
    isInvoiceGenerated: orderPayload.isInvoiceGenerated,
    seats: orderPayload.seats ?? null,
    description: orderPayload.description,
    items: orderPayload.items || [],
    discount: orderPayload.discount,
    metadata: orderPayload.metadata || {},
    customFieldData: orderPayload.customFieldData || null,
  }

  const [order] = await db
    .insert(dbTableOrder)
    .values({
      ...updateFields,
      polarId: orderPayload.id,
      polarCreatedAt: orderPayload.createdAt,
      userId,
      productId,
      subscriptionId,
      polarCustomerId: orderPayload.customerId,
      polarProductId: orderPayload.productId as string,
      polarSubscriptionId: orderPayload.subscriptionId,
      polarDiscountId: orderPayload.discountId,
      polarCheckoutId: orderPayload.checkoutId,
    })
    .onConflictDoUpdate({
      target: dbTableOrder.polarId,
      set: updateFields,
    })
    .returning()

  if (!order) {
    throw new Error(`Failed to upsert order: ${orderPayload.id}`)
  }

  console.log(`✅ Order upserted: ${orderPayload.id}`)
  return order
}
