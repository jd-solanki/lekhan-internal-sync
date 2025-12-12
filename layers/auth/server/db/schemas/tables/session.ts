import { inet, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '~~/layers/01.base/server/db/schemas/mixins'
import { user } from '.'

export const session = pgTable('session', {
  ...mixinId(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  token: text().notNull().unique(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
  ipAddress: inet(), /* postgres provides built in inet column type */
  userAgent: text(), /* User agent string length can vary hence text type is used */
  userId: integer().notNull().references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: integer().references(() => user.id, { onDelete: 'set null' }),
})
