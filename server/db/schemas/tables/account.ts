import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../mixins'
import { integer } from 'drizzle-orm/pg-core'
import { user } from '.'

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
