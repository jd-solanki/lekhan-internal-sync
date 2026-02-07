import * as z from 'zod'
import { syncOrdersByCheckoutId, syncOrdersByPolarCustomerId } from '../../../utils/polar/utils'

const schemaBody = z.object({
  checkoutId: z.uuidv4().optional(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readValidatedBody(event, schemaBody.parse)
  const user = event.context.user
  const userPolarCustomerId = user.polarCustomerId

  // Fetch orders from Polar so we can refresh entitlements immediately.
  if (body.checkoutId) {
    return {
      syncedOrders: await syncOrdersByCheckoutId(body.checkoutId),
    }
  }

  if (userPolarCustomerId) {
    return {
      syncedOrders: await syncOrdersByPolarCustomerId(userPolarCustomerId),
    }
  }

  throw createError({ status: 400, message: 'Missing checkoutId and user polarCustomerId' })
})
