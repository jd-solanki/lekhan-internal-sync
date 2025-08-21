import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar, inet } from 'drizzle-orm/pg-core'
import { lower } from '../functions'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../mixins'
import { user } from '.';
import { integer } from 'drizzle-orm/pg-core';

export const session = pgTable('session', {
  ...mixinId(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  token: text().notNull().unique(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
  ipAddress: inet(), /* postgres provides built in inet column type */
  userAgent: text(), /* User agent string length can vary hence text type is used */
  userId: integer().notNull().references(() => user.id, { onDelete: 'cascade' }),
})
