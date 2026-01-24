import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const dbSchemaVerificationSelect = createSelectSchema(dbTableVerification)
export const dbSchemaVerificationInsert = createInsertSchema(dbTableVerification)
export const dbSchemaVerificationUpdate = createUpdateSchema(dbTableVerification)

export type DBSelectVerification = InferSelectModel<typeof dbTableVerification>
export type DBInsertVerification = InferInsertModel<typeof dbTableVerification>
