import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { verification } from '#server/db/schemas/tables'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const dbVerificationSelectSchema = createSelectSchema(verification)
export const dbVerificationInsertSchema = createInsertSchema(verification)
export const dbVerificationUpdateSchema = createUpdateSchema(verification)

export type DBSelectVerification = InferSelectModel<typeof verification>
export type DBInsertVerification = InferInsertModel<typeof verification>
