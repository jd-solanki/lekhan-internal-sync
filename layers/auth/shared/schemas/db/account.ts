import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { account } from '~~/server/db/schemas/tables'

export const dbAccountSelectSchema = createSelectSchema(account)
export const dbAccountInsertSchema = createInsertSchema(account)
export const dbAccountUpdateSchema = createUpdateSchema(account)

export type DBSelectAccount = InferSelectModel<typeof account>
export type DBInsertAccount = InferInsertModel<typeof account>
