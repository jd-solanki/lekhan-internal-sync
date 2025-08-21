import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { user } from '~~/server/db/schemas/tables'
import { emailSchema } from '..'

export const dbUserSelectSchema = createSelectSchema(user, {
  email: emailSchema,
})
export const dbUserInsertSchema = createInsertSchema(user, {
  email: emailSchema,
})
export const dbUserUpdateSchema = createUpdateSchema(user, {
  email: emailSchema,
})

export type DBSelectUser = InferSelectModel<typeof user>
export type DBInsertUser = InferInsertModel<typeof user>
