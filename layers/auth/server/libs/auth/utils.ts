import type { BetterAuthOptions } from 'better-auth'

import type { Get, Paths } from 'type-fest'

import env from '#server/libs/env'
import { findCustomerByEmail, syncOrdersByPolarCustomerId, syncSubscriptionsByCustomerId } from '~~/layers/payments/server/utils/polar/utils'

type DatabaseHooksPath = Paths<BetterAuthOptions['databaseHooks']> // Auto-complete all valid paths
type DatabaseHook<P extends DatabaseHooksPath> = Get<BetterAuthOptions['databaseHooks'], P>

/*
  INFO: This hook handler is important to link existing Polar customer (from guest checkouts) to newly created user account
        This hook handler is still relevant when only authenticated users are allowed to checkout to assign polarCustomerId immediately on sign up
        We're not relying on `customer.created` webhook to add `polarCustomerId` because it may get delayed and we need `polarCustomerId` immediately after user sign up
*/
export const onBeforeUserCreateDatabaseHookInsertPolarCustomerId: DatabaseHook<'user.create.before'> = async (user, _ctx) => {
  // Fetch polar customer by email and set polarCustomerId if exists
  try {
    const customer = await findCustomerByEmail(user.email)

    return {
      data: {
        ...user,
        ...(customer ? { polarCustomerId: customer.id } : {}),
      },
    }
  }
  catch {
    sendEmailToAdmins({
      subject: `Error fetching Polar customer by email`,
      text: JSON.stringify({
        error: 'While creating user, failed to fetch polar customer by email and can\'t set polarCustomerId',
        user,
        timestamp: new Date().toISOString(),
      }),
    })
    return { data: { ...user } }
  }
}

/*
  INFO: This hook handler syncs orders & subscriptions for the newly created user when guest checkout is allowed

  You can avoid attaching this handler to hook if you only allow authenticated users to checkout
*/
export const onAfterUserCreateDatabaseHookSyncPolarOrdersAndSubscriptionsForGuestCheckout: DatabaseHook<'user.create.after'> = async (user, _ctx) => {
  // INFO: Sync orders & subscriptions for the user created with existing polarCustomerId when guest checkout is allowed
  // user.polarCustomerId can be null when user directly sign up via direct sign up page visit without purchasing (which means no customer created in Polar yet)
  //   so don't fetch in that case or else it'll fetch & sync all orders & subscriptions
  if (!env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY && user.polarCustomerId) {
    await syncOrdersByPolarCustomerId(user.polarCustomerId as string)
    await syncSubscriptionsByCustomerId(user.polarCustomerId as string)
  }
}
