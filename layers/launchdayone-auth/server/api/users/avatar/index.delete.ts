import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { user } from '~~/server/db/schemas/tables/user'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { image: true },
  })

  if (!currentUser?.image) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No avatar to delete',
    })
  }

  const storage = useStorage('file')
  await storage.removeItem(currentUser.image).catch(() => {})

  await db
    .update(user)
    .set({ image: null })
    .where(eq(user.id, userId))

  setResponseStatus(event, 204)
})
