import type { H3Event } from 'h3'
import { Buffer } from 'node:buffer'
import { randomUUID as uuidV4 } from 'node:crypto'
import { fileTypeFromBuffer } from 'file-type'

export async function extractUploadedFiles(event: H3Event) {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      status: 400,
      message: 'No file provided',
    })
  }

  return formData
}

export async function validateUploadedFile(
  fileData: { data: Buffer },
  options: { maxSizeMB: number, allowedMimeTypes: string[] },
) {
  const { maxSizeMB, allowedMimeTypes } = options

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (fileData.data.length > maxSizeBytes) {
    throw createError({
      status: 400,
      message: `File size exceeds ${maxSizeMB}MB limit`,
    })
  }

  const detectedType = await fileTypeFromBuffer(fileData.data)

  if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
    const types = allowedMimeTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
    throw createError({
      status: 400,
      message: `File type not supported. Allowed types: ${types}`,
    })
  }

  return detectedType
}

export async function downloadAndStoreExternalImage(imageUrl: string): Promise<string | null> {
  const maxSizeMB = 1
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif']
  const avatarPrefix = 'avatars/'

  try {
    const arrayBuffer = await $fetch<ArrayBuffer>(imageUrl, { responseType: 'arrayBuffer' })
    const buffer = Buffer.from(arrayBuffer)
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (buffer.length > maxSizeBytes)
      return null

    const detectedType = await fileTypeFromBuffer(buffer)

    if (!detectedType || !allowedMimeTypes.includes(detectedType.mime))
      return null

    const filePath = `${avatarPrefix}${uuidV4()}.${detectedType.ext}`
    const storage = useStorage('file')
    await storage.setItemRaw(filePath, buffer)

    return filePath
  }
  catch (error) {
    console.warn('[auth] failed to download external avatar image', error)
    return null
  }
}
