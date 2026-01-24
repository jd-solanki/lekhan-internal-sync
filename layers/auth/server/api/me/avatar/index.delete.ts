import { eq } from 'drizzle-orm'
import { user } from '~~/layers/auth/server/db/schemas/tables/user'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { image: true },
  })

  if (!currentUser?.image) {
    throw createError({
      status: 404,
      statusText: 'No avatar to delete',
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
