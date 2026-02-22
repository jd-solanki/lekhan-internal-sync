import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTableAccount } from '~~/server/db/schemas/tables'

export const dbSchemaSelectAccount = createSelectSchema(dbTableAccount)
export const dbSchemaInsertAccount = createInsertSchema(dbTableAccount)
export const dbSchemaUpdateAccount = createUpdateSchema(dbTableAccount)

export type DBSelectAccount = InferSelectModel<typeof dbTableAccount>
export type DBInsertAccount = InferInsertModel<typeof dbTableAccount>
