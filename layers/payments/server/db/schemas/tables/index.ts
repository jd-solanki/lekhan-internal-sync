import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'
import { user } from '../../../../../../layers/auth/server/db/schemas/tables/user'

// SECTION Product
export const dbTableProduct = pgTable('polar_product', {
  ...mixinId(),
  polarId: text().notNull().unique(),
  polarCreatedAt: timestamp({ withTimezone: true }).notNull(),
  polarModifiedAt: timestamp({ withTimezone: true }),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),

  trialInterval: text(),
  trialIntervalCount: integer(),

  name: text().notNull(),
  description: text(),

  recurringInterval: text(),
  recurringIntervalCount: integer(),

  isRecurring: boolean().notNull().default(false),
  isArchived: boolean().notNull().default(false),

  organizationId: text().notNull(),
  metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),

  benefits: jsonb().$type<Record<string, unknown>[]>().notNull().default([]),
  medias: jsonb().notNull().default([]),
  prices: jsonb().$type<Record<string, unknown>[]>().notNull().default([]),
})
// !SECTION

// SECTION Subscription
export const dbTableSubscription = pgTable('polar_subscription', {
  ...mixinId(),
  polarId: text().notNull().unique(),
  polarCreatedAt: timestamp({ withTimezone: true }).notNull(),
  polarModifiedAt: timestamp({ withTimezone: true }),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),

  userId: integer().notNull().references(() => user.id),
  productId: integer().notNull().references(() => dbTableProduct.id),

  status: text().notNull(),
  amount: integer().notNull(),
  currency: text().notNull(),
  recurringInterval: text().notNull(),
  recurringIntervalCount: integer().notNull(),

  currentPeriodStart: timestamp({ withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp({ withTimezone: true }),
  trialStart: timestamp({ withTimezone: true }),
  trialEnd: timestamp({ withTimezone: true }),
  startedAt: timestamp({ withTimezone: true }),
  endsAt: timestamp({ withTimezone: true }),
  endedAt: timestamp({ withTimezone: true }),

  cancelAtPeriodEnd: boolean().notNull().default(false),
  canceledAt: timestamp({ withTimezone: true }),
  customerCancellationReason: text(),
  customerCancellationComment: text(),

  polarCustomerId: text().notNull(),
  polarProductId: text().notNull(),
  polarDiscountId: text(),
  polarCheckoutId: text(),

  seats: integer(),

  prices: jsonb().$type<Record<string, unknown>[]>().notNull().default([]),
  meters: jsonb().notNull().default([]),
  discount: jsonb(),
  metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),
  customFieldData: jsonb(),
})
// !SECTION

// SECTION Order
export const dbTableOrder = pgTable('polar_order', {
  ...mixinId(),
  polarId: text().notNull().unique(),
  polarCreatedAt: timestamp({ withTimezone: true }).notNull(),
  polarModifiedAt: timestamp({ withTimezone: true }),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),

  userId: integer().notNull().references(() => user.id),
  productId: integer().notNull().references(() => dbTableProduct.id),
  subscriptionId: integer().references(() => dbTableSubscription.id),

  status: text().notNull(),
  paid: boolean().notNull().default(false),
  billingReason: text().notNull(),

  subtotalAmount: integer().notNull(),
  discountAmount: integer().notNull(),
  netAmount: integer().notNull(),
  taxAmount: integer().notNull(),
  totalAmount: integer().notNull(),
  appliedBalanceAmount: integer().notNull(),
  dueAmount: integer().notNull(),
  refundedAmount: integer().notNull(),
  refundedTaxAmount: integer().notNull(),
  platformFeeAmount: integer().notNull(),

  currency: text().notNull(),

  billingName: text(),
  billingAddress: jsonb(),

  invoiceNumber: text().notNull(),
  isInvoiceGenerated: boolean().notNull().default(false),

  polarCustomerId: text().notNull(),
  polarProductId: text().notNull(),
  polarSubscriptionId: text(),
  polarDiscountId: text(),
  polarCheckoutId: text(),

  seats: integer(),
  description: text().notNull(),

  items: jsonb().$type<Record<string, unknown>[]>().notNull().default([]),
  discount: jsonb(),
  metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),
  customFieldData: jsonb(),
})
// !SECTION
