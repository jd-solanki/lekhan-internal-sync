import * as z from 'zod'
import { polarClient } from '~~/layers/payments/server/libs/polar'

const schemaRouterParams = z.object({
  id: z.uuidv4(),
})

const schemaPlanChangeBody = z.object({
  productId: z.uuidv4(),
  // If not provided as default, `invoice` is used (if default not provided Polar uses org default)
  prorationBehavior: z.enum(['invoice', 'prorate']).nullish().default('invoice'),
})

const schemaCancelBody = z.object({
  // Polar accepts cancel or uncancel via this flag.
  cancelAtPeriodEnd: z.boolean().nullish(),
  cancellationReason: z.enum([
    'customer_service',
    'low_quality',
    'missing_features',
    'switched_service',
    'too_complex',
    'too_expensive',
    'unused',
    'other',
  ]).nullish(),
  cancellationComment: z.string().nullish(),
})

const schemaBody = z.union([schemaPlanChangeBody, schemaCancelBody])

export default defineAuthenticatedEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)
  const body = await readValidatedBody(event, schemaBody.parse)

  const updatedPolarSubscription = await polarClient.subscriptions.update({
    id: routerParams.id,
    subscriptionUpdate: body,
  })

  return updatedPolarSubscription
})
