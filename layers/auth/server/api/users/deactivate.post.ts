import { db } from '#server/db'
import { eq } from 'drizzle-orm'
import { user } from '~~/layers/auth/server/db/schemas/tables/user'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  try {
    // Set deactivatedAt timestamp
    const [updatedUser] = await db
      .update(user)
      .set({ deactivatedAt: new Date() })
      .where(eq(user.id, userId))
      .returning()

    return {
      success: true,
      user: updatedUser,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to deactivate account',
      data: error,
    })
  }
})
