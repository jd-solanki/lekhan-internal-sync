import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import * as z from 'zod'
import { emailSchema } from '~~/layers/auth/shared/schemas'
import { dbTableUser } from '~~/server/db/schemas/tables'

const userTableNameSchema = z.string({ error: 'Name is required' }).max(255)

export const dbSchemaUserSelect = createSelectSchema(dbTableUser, {
  email: emailSchema,
})
export const dbSchemaUserInsert = createInsertSchema(dbTableUser, {
  email: emailSchema,
  name: userTableNameSchema,
  deactivatedAt: z.coerce.date().nullable(),
})
export const dbSchemaUserUpdate = createUpdateSchema(dbTableUser, {
  email: emailSchema.optional(),
  name: userTableNameSchema.optional(),
  deactivatedAt: z.coerce.date().nullable().optional(),
})

export type DBSelectUser = InferSelectModel<typeof dbTableUser>
export type DBInsertUser = InferInsertModel<typeof dbTableUser>
export type DBUpdateUser = Partial<DBInsertUser> & { id?: DBInsertUser['id'] }
