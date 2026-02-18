import { dbSchemaNoteInsert, dbSchemaNoteUpdate } from './db'

// API schemas - exported for endpoint validation
export const noteCreateSchema = dbSchemaNoteInsert.pick({ title: true, content: true }).required()
export const noteUpdateSchema = dbSchemaNoteUpdate
  .pick({ title: true, content: true })
  .refine(
    data => data.title !== undefined || data.content !== undefined,
    { message: 'Must provide title or content to update' },
  )
