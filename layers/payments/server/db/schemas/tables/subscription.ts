import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { dbTablePolarProduct, dbTableUser } from '~~/server/db/schemas/tables'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const dbTablePolarSubscription = pgTable('polar_subscription', {
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
