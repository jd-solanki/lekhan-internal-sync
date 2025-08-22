import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../mixins'

export const verification = pgTable('verification', {
  ...mixinId(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
})
