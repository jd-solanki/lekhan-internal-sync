import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTableSession } from '~~/server/db/schemas/tables'

export const dbSchemaSelectSession = createSelectSchema(dbTableSession)
export const dbSchemaInsertSession = createInsertSchema(dbTableSession)
export const dbSchemaUpdateSession = createUpdateSchema(dbTableSession)

export type DBSelectSession = InferSelectModel<typeof dbTableSession>
export type DBInsertSession = InferInsertModel<typeof dbTableSession>
