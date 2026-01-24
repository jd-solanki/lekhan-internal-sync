import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const dbSchemaSessionSelect = createSelectSchema(dbTableSession)
export const dbSchemaSessionInsert = createInsertSchema(dbTableSession)
export const dbSchemaSessionUpdate = createUpdateSchema(dbTableSession)

export type DBSelectSession = InferSelectModel<typeof dbTableSession>
export type DBInsertSession = InferInsertModel<typeof dbTableSession>
