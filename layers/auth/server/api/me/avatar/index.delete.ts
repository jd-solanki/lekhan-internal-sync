import { eq } from 'drizzle-orm'
import { dbTableUser } from '~~/server/db/schemas/tables'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const currentUser = await db.query.dbTableUser.findFirst({
    where: eq(dbTableUser.id, userId),
    columns: { image: true },
  })

  if (!currentUser?.image) {
    throw createError({
      status: 404,
      message: 'No avatar to delete',
    })
  }

  const storage = useStorage('file')
  await storage.removeItem(currentUser.image).catch(() => {})

  await db
    .update(dbTableUser)
    .set({ image: null })
    .where(eq(dbTableUser.id, userId))

  setResponseStatus(event, 204)
})
