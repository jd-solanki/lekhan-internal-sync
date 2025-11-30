import * as z from 'zod'
import { paginationSchema } from '~~/layers/launchdayone-core/shared/schemas/pagination'
import { polarClient } from '~~/layers/launchdayone-payments/server/libs/polar'

const querySchema = paginationSchema.extend({
  customerId: z.uuidv4().optional(),
  organizationId: z.uuidv4().optional(),
  productId: z.uuidv4().optional(),
  productBillingType: z.enum(['recurring', 'one_time']).optional(),
  discountId: z.uuidv4().optional(),
  checkoutId: z.uuidv4().optional(),
  sorting: z.array(z.enum(['created_at', '-created_at', 'status', '-status', 'invoice_number', '-invoice_number', 'amount', '-amount', 'net_amount', '-net_amount', 'customer', '-customer', 'product', '-product', 'discount', '-discount', 'subscription', '-subscription'])).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export default defineAuthenticatedEventHandler(async (event) => {
  const { page, size, ...rest } = await getValidatedQuery(event, querySchema.parse)

  const result = await polarClient.orders.list({
    page,
    limit: size,
    ...rest,
  })

  return result
})
