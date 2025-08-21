import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { lower } from '../functions'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../mixins'

export const user = pgTable('user', {
  ...mixinId(),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: boolean().default(false).notNull(),
  name: varchar({ length: 255 }).notNull(),
  image: text(),
  lastSignInAt: timestamp({ withTimezone: true }),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
  ...mixinDeletedAt('deactivatedAt', 'deactivated_at'),
}, table => [
  // uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
  uniqueIndex('emailUniqueIndex').on(lower(table.email)),
])
