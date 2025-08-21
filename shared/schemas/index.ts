import { z } from 'zod/v4'

export const emailSchema = z.email({ error: e => !e.input ? 'Email is required' : 'Invalid email address' }).max(255, { error: 'Email must not exceed 255 characters' }).lowercase()
export const plainPasswordSchema = z.string({ error: 'Password is required' }).min(8, { error: 'Password must be at least 8 characters' })

export const schemaOptionalRedirectUrl = z.object({
  redirectUrl: z.preprocess((val) => {
    if (typeof val === 'string')
      return decodeURIComponent(val)
    return val
  }, z.string().startsWith('/').optional()),
})

export type SchemaOptionalRedirectUrl = z.infer<typeof schemaOptionalRedirectUrl>
