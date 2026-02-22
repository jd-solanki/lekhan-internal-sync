import {
  dbTableAccount,
  dbTableSession,
  dbTableUser,
} from '#server/db/schemas/tables'
import { relations } from 'drizzle-orm'

export const dbTableAccountRelations = relations(dbTableAccount, ({ one }) => ({
  user: one(dbTableUser, {
    fields: [dbTableAccount.userId],
    references: [dbTableUser.id],
  }),
}))

export const dbTableSessionRelations = relations(dbTableSession, ({ one }) => ({
  user: one(dbTableUser, {
    fields: [dbTableSession.userId],
    references: [dbTableUser.id],
    relationName: 'sessionUser',
  }),
  impersonator: one(dbTableUser, {
    fields: [dbTableSession.impersonatedBy],
    references: [dbTableUser.id],
    relationName: 'sessionImpersonator',
  }),
}))
