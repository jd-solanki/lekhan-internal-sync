import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const dbSchemaAccountSelect = createSelectSchema(dbTableAccount)
export const dbSchemaAccountInsert = createInsertSchema(dbTableAccount)
export const dbSchemaAccountUpdate = createUpdateSchema(dbTableAccount)

export type DBSelectAccount = InferSelectModel<typeof dbTableAccount>
export type DBInsertAccount = InferInsertModel<typeof dbTableAccount>
