import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import * as z from 'zod'
import { user } from '~~/server/db/schemas/tables'
import { emailSchema } from '..'

const userTableNameSchema = z.string({ error: 'Name is required' }).max(255)

export const dbUserSelectSchema = createSelectSchema(user, {
  email: emailSchema,
})
export const dbUserInsertSchema = createInsertSchema(user, {
  email: emailSchema,
  name: userTableNameSchema,
  deactivatedAt: z.coerce.date().nullable(),
})
export const dbUserUpdateSchema = createUpdateSchema(user, {
  email: emailSchema.optional(),
  name: userTableNameSchema.optional(),
  deactivatedAt: z.coerce.date().nullable().optional(),
})

export type DBSelectUser = InferSelectModel<typeof user>
export type DBInsertUser = InferInsertModel<typeof user>
export type DBUpdateUser = Partial<DBInsertUser> & { id?: DBInsertUser['id'] }
