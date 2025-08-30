import { polarClient } from '~~/server/libs/polar'

export const getPolarCustomerState = (userId: number) => polarClient.customers.getStateExternal({ externalId: userId.toString() })
