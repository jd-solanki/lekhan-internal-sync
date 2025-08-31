import { boolean, date, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { lower } from '../functions'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../mixins'

export const userRoles = ['admin', 'user'] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum('user_roles', userRoles)

export const user = pgTable('user', {
  ...mixinId(),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: boolean().default(false).notNull(),
  name: varchar({ length: 255 }).notNull(),
  image: text(),
  lastSignInAt: timestamp({ withTimezone: true }),
  role: userRoleEnum().default('user'),
  banned: boolean().default(false).notNull(),
  banReason: text(),
  banExpires: date(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
  ...mixinDeletedAt('deactivatedAt', 'deactivated_at'),
}, table => [
  // uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
  uniqueIndex('emailUniqueIndex').on(lower(table.email)),
])
