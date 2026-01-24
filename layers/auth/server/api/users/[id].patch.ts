import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { user } from '~~/layers/auth/server/db/schemas/tables/user'

const schemaRouterParams = z.object({
  id: idSchema,
})

export default defineAdminEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)
  const parsedBody = await readValidatedBody(event, dbUserUpdateSchema.parse)

  // Set deactivatedAt to current timestamp
  const [updatedUser] = await db
    .update(user)
    .set(parsedBody)
    .where(eq(user.id, routerParams.id))
    .returning()

  return updatedUser
})
