import { eq } from 'drizzle-orm'
import * as z from 'zod'

const schemaRouterParams = z.object({
  id: idSchema,
})

export default defineAdminEventHandler(async (event) => {
  const routerParams = await getValidatedRouterParams(event, schemaRouterParams.parse)
  const parsedBody = await readValidatedBody(event, dbSchemaUserUpdate.parse)

  // Set deactivatedAt to current timestamp
  const [updatedUser] = await db
    .update(dbTableUser)
    .set(parsedBody)
    .where(eq(dbTableUser.id, routerParams.id))
    .returning()

  return updatedUser
})
