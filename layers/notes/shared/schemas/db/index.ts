import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import * as z from 'zod'
import { dbTableNote } from '~~/layers/notes/server/db/schemas/tables/note'

// Reusable field schemas
const noteTitleSchema = z.string().trim().min(1, 'Title cannot be empty').max(255, 'Title must be 255 characters or less')
const noteContentSchema = z.string().max(102400, 'Content exceeds 100KB limit')

export const dbSchemaSelectNote = createSelectSchema(dbTableNote)
export const dbSchemaInsertNote = createInsertSchema(dbTableNote, {
  title: noteTitleSchema,
  content: noteContentSchema,
})
export const dbSchemaUpdateNote = createUpdateSchema(dbTableNote, {
  title: noteTitleSchema,
  content: noteContentSchema,
})

export type DBSelectNote = InferSelectModel<typeof dbTableNote>
export type DBInsertNote = InferInsertModel<typeof dbTableNote>
