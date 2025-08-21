import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { verification } from '~~/server/db/schemas/tables'

export const dbVerificationSelectSchema = createSelectSchema(verification)
export const dbVerificationInsertSchema = createInsertSchema(verification)
export const dbVerificationUpdateSchema = createUpdateSchema(verification)

export type DBSelectVerification = InferSelectModel<typeof verification>
export type DBInsertVerification = InferInsertModel<typeof verification>
