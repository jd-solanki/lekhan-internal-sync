export function genImgUrlFromKey(key: string | undefined | null): string | undefined {
  if (!key) {
    return undefined
  }

  // Return nitro server asset URL in dev mode
  if (import.meta.dev)
    // NOTE: Sync it with `nuxt.config.ts`'s `nitro.devStorage.file.base`
    return `/.tmp/${key}`

  const runtimeConfig = useRuntimeConfig()

  // S3 public URL: https://<bucket>.s3.<region>.amazonaws.com/<key>
  const bucket = runtimeConfig.public.shared.aws.s3.bucketName
  const region = runtimeConfig.public.shared.aws.s3.region
  const baseUrl = `${bucket}.s3.${region}.amazonaws.com`

  return `https://${baseUrl}/${encodeURIComponent(key)}`
}

export function validateFile(
  file: File,
  options?: { maxSizeMB?: number, allowedMimeTypes?: string[] },
): { isValid: boolean, error?: string } {
  const { maxSizeMB = 2, allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'] } = options || {}

  // Validate file type
  if (!allowedMimeTypes.includes(file.type)) {
    const types = allowedMimeTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${types}`,
    }
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    }
  }

  return { isValid: true }
}
