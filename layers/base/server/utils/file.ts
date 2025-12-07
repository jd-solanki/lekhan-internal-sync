import type { H3Event } from 'h3'
import type { Buffer } from 'node:buffer'
import { fileTypeFromBuffer } from 'file-type'

export async function extractUploadedFiles(event: H3Event) {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file provided',
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
      statusCode: 400,
      statusMessage: `File size exceeds ${maxSizeMB}MB limit`,
    })
  }

  const detectedType = await fileTypeFromBuffer(fileData.data)

  if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
    const types = allowedMimeTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
    throw createError({
      statusCode: 400,
      statusMessage: `File type not supported. Allowed types: ${types}`,
    })
  }

  return detectedType
}
