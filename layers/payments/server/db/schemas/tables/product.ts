import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const dbTablePolarProduct = pgTable('polar_product', {
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
