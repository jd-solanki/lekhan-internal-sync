// NOTE: Use relative path so Drizzle CLI can find the schema files
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from '.'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const account = pgTable('account', {
  ...mixinId(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: integer().notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true }),
  scope: text(),
  password: text(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
})
