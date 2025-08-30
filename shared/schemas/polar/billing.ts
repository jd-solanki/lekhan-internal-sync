import * as z from 'zod'

// Base address schema - reusable for validation
export const schemaPolarOrderBillingAddress = z.object({
  line1: z.string().max(100, 'Address line 1 is too long').nullish(),
  line2: z.string().max(100, 'Address line 2 is too long').nullish(),
  postalCode: z.string().max(20, 'Postal code is too long').nullish(),
  city: z.string().max(50, 'City name is too long').nullish(),
  state: z.string().max(50, 'State name is too long').nullish(),
  country: z.string({ error: e => !e.input ? 'Country is required' : 'Invalid country' })
    .min(1, 'Country is required')
    .max(50, 'Country name is too long'),
})
export type SchemaPolarOrderBillingAddress = z.infer<typeof schemaPolarOrderBillingAddress>

// Billing name schema - optional as per Polar SDK Order type
export const schemaPolarOrderBillingName = z.object({
  billingName: z.string().max(100, 'Name is too long').nullable(),
})
export type SchemaPolarOrderBillingName = z.infer<typeof schemaPolarOrderBillingName>

export const schemaPolarOrderBillingUpdate = z.object({
  billingName: schemaPolarOrderBillingName.shape.billingName,
  billingAddress: schemaPolarOrderBillingAddress,
})
export type SchemaPolarOrderBillingUpdate = z.infer<typeof schemaPolarOrderBillingUpdate>

export const schemaPolarOrderBillingUpdateFlatten = z.object({
  ...schemaPolarOrderBillingUpdate.pick({ billingAddress: true }).shape.billingAddress.shape,
  ...schemaPolarOrderBillingUpdate.pick({ billingName: true }).shape,
})
export type SchemaPolarOrderBillingUpdateFlatten = z.infer<typeof schemaPolarOrderBillingUpdateFlatten>
