import { eq } from 'drizzle-orm'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  try {
    // Set deactivatedAt timestamp
    const [updatedUser] = await db
      .update(dbTableUser)
      .set({ deactivatedAt: new Date() })
      .where(eq(dbTableUser.id, userId))
      .returning()

    return {
      success: true,
      user: updatedUser,
    }
  }
  catch (error) {
    throw createError({
      status: 500,
      statusText: 'Failed to deactivate account',
      data: error,
    })
  }
})
