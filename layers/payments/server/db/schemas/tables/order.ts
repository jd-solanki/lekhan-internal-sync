import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { dbTablePolarProduct, dbTablePolarSubscription, dbTableUser } from '~~/server/db/schemas/tables'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const dbTablePolarOrder = pgTable('polar_order', {
  ...mixinId(),
  polarId: text().notNull().unique(),
  polarCreatedAt: timestamp({ withTimezone: true }).notNull(),
  polarModifiedAt: timestamp({ withTimezone: true }),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
  // If checkout is only for authenticated users, mark userId required
  userId: process.env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY === 'true'
    ? integer().notNull().references(() => dbTableUser.id)
    : integer().references(() => dbTableUser.id),
  productId: integer().notNull().references(() => dbTablePolarProduct.id),
  subscriptionId: integer().references(() => dbTablePolarSubscription.id),

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
