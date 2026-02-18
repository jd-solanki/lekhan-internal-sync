import { index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { dbTableUser } from '~~/server/db/schemas/tables'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '../../../../../../layers/01.base/server/db/schemas/mixins'

export const dbTableNote = pgTable('note', {
  ...mixinId(),
  userId: integer().notNull().references(() => dbTableUser.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  title: text().notNull().default('Untitled'),
  content: text().notNull().default(''),
  position: integer().notNull(),
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
}, table => [
  index('note_user_id_idx').on(table.userId),
  index('note_user_id_position_idx').on(table.userId, table.position),
  uniqueIndex('note_user_id_position_unique').on(table.userId, table.position),
])
