/* eslint-disable no-console */
import type { Customer } from '@polar-sh/sdk/models/components/customer'
import type { PolarWebhookEvent } from '../types'

import { Customer$inboundSchema } from '@polar-sh/sdk/models/components/customer'
import { eq } from 'drizzle-orm'
import { lower } from '~~/layers/01.base/server/db/schemas/functions'

/**
 * Parse and validate the customer payload from Polar.
 * Example usage: safely access `payload.id` and `payload.email` after validation.
 */
function parseCustomerPayload(rawData: unknown, eventType: string): Customer | null {
  const result = Customer$inboundSchema.safeParse(rawData)

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
 * Handle `customer.created` by syncing `user.polarCustomerId` using the Polar email.
 * Example usage: event.data.email -> match user -> set `polarCustomerId`.
 */
export async function handleCustomerCreated(event: PolarWebhookEvent): Promise<void> {
  const customerPayload = parseCustomerPayload(event.data, event.type)

  if (!customerPayload) {
    console.error(`Skipping ${event.type} due to validation failure`)
    return
  }

  if (!customerPayload.email || !customerPayload.id) {
    console.error(`Skipping ${event.type} due to missing email or id`)
    return
  }

  const normalizedEmail = customerPayload.email.trim().toLowerCase()

  const existingUser = await db.query.dbTableUser.findFirst({
    where: eq(lower(dbTableUser.email), normalizedEmail),
  })

  if (!existingUser) {
    console.warn(`No user found for Polar customer email: ${normalizedEmail}`)
    return
  }

  if (existingUser.polarCustomerId === customerPayload.id) {
    console.log(`⏭️  Polar customer already linked for user id=${existingUser.id}`)
    return
  }

  await db.update(dbTableUser)
    .set({ polarCustomerId: customerPayload.id })
    .where(eq(dbTableUser.id, existingUser.id))

  console.log(`✅ Linked Polar customer id=${customerPayload.id} to user id=${existingUser.id}`)
}
