import type * as z from 'zod'
import { dbSchemaInsertNote, dbSchemaUpdateNote } from './db/index'

export const publicSchemaCreateNote = dbSchemaInsertNote.pick({ title: true, content: true }).required()
export const publicSchemaUpdateNote = dbSchemaUpdateNote
  .pick({ title: true, content: true })
  .refine(
    data => data.title !== undefined || data.content !== undefined,
    { message: 'Must provide title or content to update' },
  )

export type PublicSchemaCreateNote = z.infer<typeof publicSchemaCreateNote>
export type PublicSchemaUpdateNote = z.infer<typeof publicSchemaUpdateNote>
