import { randomUUID as uuidV4 } from 'node:crypto'

import { eq } from 'drizzle-orm'
import { user } from '~~/layers/auth/server/db/schemas/tables/user'

const MAX_SIZE_MB = 1
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif']
const AVATAR_PREFIX = 'avatars/'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id

  const formData = await extractUploadedFiles(event)
  const fileData = formData[0]

  const detectedType = await validateUploadedFile(fileData, {
    maxSizeMB: MAX_SIZE_MB,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
  })

  const extension = detectedType.ext
  const filePath = `${AVATAR_PREFIX}${uuidV4()}.${extension}`

  const storage = useStorage('file')
  await storage.setItemRaw(filePath, fileData.data)

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { image: true },
  })

  if (currentUser?.image) {
    await storage.removeItem(currentUser.image).catch(() => {})
  }

  await db
    .update(user)
    .set({ image: filePath })
    .where(eq(user.id, userId))

  return {
    filePath,
  }
})
