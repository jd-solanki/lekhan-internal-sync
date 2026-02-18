import { db } from '#server/db'
import { dbTableNote } from '#server/db/schemas/tables'
import { asc, count, eq } from 'drizzle-orm'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  // Fetch notes metadata only (no content)
  const [notes, totalResult] = await Promise.all([
    db
      .select({
        id: dbTableNote.id,
        title: dbTableNote.title,
        position: dbTableNote.position,
        createdAt: dbTableNote.createdAt,
        updatedAt: dbTableNote.updatedAt,
      })
      .from(dbTableNote)
      .where(eq(dbTableNote.userId, userId))
      .orderBy(asc(dbTableNote.position)),
    db
      .select({ total: count() })
      .from(dbTableNote)
      .where(eq(dbTableNote.userId, userId)),
  ])

  const total = totalResult[0]?.total ?? 0

  return {
    data: notes,
    meta: {
      total,
    },
  }
})
