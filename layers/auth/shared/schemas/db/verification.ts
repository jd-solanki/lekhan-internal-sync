import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTableVerification } from '~~/server/db/schemas/tables'

export const dbSchemaSelectVerification = createSelectSchema(dbTableVerification)
export const dbSchemaInsertVerification = createInsertSchema(dbTableVerification)
export const dbSchemaUpdateVerification = createUpdateSchema(dbTableVerification)

export type DBSelectVerification = InferSelectModel<typeof dbTableVerification>
export type DBInsertVerification = InferInsertModel<typeof dbTableVerification>
