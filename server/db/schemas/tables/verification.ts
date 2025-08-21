import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { lower } from '../functions'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../mixins'

export const verification = pgTable('verification', {
  ...mixinId(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
})
