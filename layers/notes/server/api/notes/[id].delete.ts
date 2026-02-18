import { db } from '#server/db'
import { dbTableNote } from '#server/db/schemas/tables'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { idSchema } from '~~/layers/auth/shared/schemas'

const schemaRouterParams = z.object({
  id: idSchema,
})

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const { id } = await getValidatedRouterParams(event, schemaRouterParams.parse)

  // Delete note with ownership check
  const [deletedNote] = await db
    .delete(dbTableNote)
    .where(and(
      eq(dbTableNote.id, id),
      eq(dbTableNote.userId, userId),
    ))
    .returning()

  if (!deletedNote) {
    throw createError({
      status: 404,
      message: 'Note not found',
    })
  }

  setResponseStatus(event, 204)
})
