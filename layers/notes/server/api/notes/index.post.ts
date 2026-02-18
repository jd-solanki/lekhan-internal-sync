import { db } from '#server/db'
import { dbTableNote } from '#server/db/schemas/tables'
import { eq, max } from 'drizzle-orm'
import { canUserCreateNote } from '~~/layers/notes/server/utils/plan-limit'
import { noteCreateSchema } from '~~/layers/notes/shared/schemas/note'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const body = await readValidatedBody(event, noteCreateSchema.parse)

  // Check plan limit
  const { allowed, noteCount, noteLimit } = await canUserCreateNote(userId)
  if (!allowed) {
    throw createError({
      status: 403,
      message: `Note limit reached. Your plan allows ${noteLimit} notes and you have ${noteCount}.`,
    })
  }

  // Get max position for auto-assignment
  const result = await db
    .select({ maxPos: max(dbTableNote.position) })
    .from(dbTableNote)
    .where(eq(dbTableNote.userId, userId))

  const nextPosition = (result[0]?.maxPos ?? 0) + 1

  const [newNote] = await db
    .insert(dbTableNote)
    .values({
      userId,
      title: body.title,
      content: body.content,
      position: nextPosition,
    })
    .returning()

  if (!newNote) {
    throw createError({
      status: 500,
      message: 'Failed to create note',
    })
  }

  setResponseStatus(event, 201)
  setResponseHeader(event, 'Location', `/api/notes/${newNote.id}`)

  return newNote
})
