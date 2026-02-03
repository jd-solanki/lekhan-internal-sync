import { polarClient } from '~~/layers/payments/server/libs/polar'
import { upsertOrderFromPolar } from '../../services/polar/order'
import { upsertSubscriptionFromPolar } from '../../services/polar/subscription'

export const getPolarCustomerState = (userId: number) => polarClient.customers.getStateExternal({ externalId: userId.toString() })

export async function findCustomerByEmail(email: string) {
  const response = await polarClient.customers.list({
    email,
    limit: 1,
  })
  return response.result.items[0]
}

export async function syncSubscriptionByPolarSubscriptionId(polarSubscriptionId: string) {
  const subscription = await polarClient.subscriptions.get({
    id: polarSubscriptionId,
  })

  return upsertSubscriptionFromPolar(subscription)
}

export async function syncSubscriptionsByCustomerId(polarCustomerId: string): Promise<DBSelectPolarSubscription[]> {
  // Fetch subscriptions from Polar so we can refresh entitlements immediately.
  const response = await polarClient.subscriptions.list({ customerId: polarCustomerId })

  const subscriptions = response.result.items

  return Promise.all(subscriptions.map(subscription => upsertSubscriptionFromPolar(subscription)))
}

export async function syncOrdersByCheckoutId(checkoutId: string): Promise<DBSelectPolarOrder[]> {
  // Fetch orders from Polar so we can refresh entitlements immediately.
  const response = await polarClient.orders.list({ checkoutId })

  const orders = response.result.items

  return Promise.all(orders.map(order => upsertOrderFromPolar(order)))
}

export async function syncOrdersByPolarCustomerId(polarCustomerId: string): Promise<DBSelectPolarOrder[]> {
// Fetch orders from Polar so we can refresh entitlements immediately.
  const response = await polarClient.orders.list({ customerId: polarCustomerId })

  const orders = response.result.items

  return Promise.all(orders.map(order => upsertOrderFromPolar(order)))
}
