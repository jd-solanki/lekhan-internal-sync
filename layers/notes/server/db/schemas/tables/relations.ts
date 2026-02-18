import { relations } from 'drizzle-orm'
import { dbTableUser } from '~~/server/db/schemas/tables'
import { dbTableNote } from './note'

export const dbNoteRelations = relations(dbTableNote, ({ one }) => ({
  user: one(dbTableUser, {
    fields: [dbTableNote.userId],
    references: [dbTableUser.id],
  }),

}))
