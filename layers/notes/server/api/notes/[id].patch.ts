import { db } from '#server/db'
import { dbTableNote } from '#server/db/schemas/tables'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { idSchema } from '~~/layers/auth/shared/schemas'
import { noteUpdateSchema } from '~~/layers/notes/shared/schemas/note'

const schemaRouterParams = z.object({
  id: idSchema,
})

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const { id } = await getValidatedRouterParams(event, schemaRouterParams.parse)

  const body = await readValidatedBody(event, noteUpdateSchema.parse)

  const [updatedNote] = await db
    .update(dbTableNote)
    .set(body)
    .where(and(
      eq(dbTableNote.id, id),
      eq(dbTableNote.userId, userId),
    ))
    .returning()

  if (!updatedNote) {
    throw createError({
      status: 404,
      message: 'Note not found',
    })
  }

  return updatedNote
})
