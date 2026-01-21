// NOTE: Use relative path so Drizzle CLI can find the schema files
import { boolean, date, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { lower } from '../../../../../../layers/01.base/server/db/schemas/functions'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const userRoles = ['admin', 'user'] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum('user_roles', userRoles)

// INFO: If you're adding more fields to user table, ensure to update better-auth's user.additionalFields in server/libs/auth/index.ts
export const user = pgTable('user', {
  ...mixinId(),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: boolean().default(false).notNull(),
  name: varchar({ length: 255 }).notNull(),
  image: text(),
  lastSignInAt: timestamp({ withTimezone: true }),
  polarCustomerId: uuid('polar_customer_id').unique(),
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
