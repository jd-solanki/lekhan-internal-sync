import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { session } from '#server/db/schemas/tables'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const dbSessionSelectSchema = createSelectSchema(session)
export const dbSessionInsertSchema = createInsertSchema(session)
export const dbSessionUpdateSchema = createUpdateSchema(session)

export type DBSelectSession = InferSelectModel<typeof session>
export type DBInsertSession = InferInsertModel<typeof session>
