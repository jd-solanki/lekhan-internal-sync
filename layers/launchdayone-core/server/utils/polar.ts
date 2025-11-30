import { polarClient } from '~~/layers/launchdayone-payments/server/libs/polar'

export const getPolarCustomerState = (userId: number) => polarClient.customers.getStateExternal({ externalId: userId.toString() })
