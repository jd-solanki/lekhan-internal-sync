// NOTE: Use relative path so Drizzle CLI can find the schema files
import { inet, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { dbTableUser } from '~~/server/db/schemas/tables'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const dbTableSession = pgTable('session', {
  ...mixinId(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  token: text().notNull().unique(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
  ipAddress: inet(), /* postgres provides built in inet column type */
  userAgent: text(), /* User agent string length can vary hence text type is used */
  userId: integer().notNull().references(() => dbTableUser.id, { onDelete: 'cascade' }),
  impersonatedBy: integer().references(() => dbTableUser.id, { onDelete: 'set null' }),
})
