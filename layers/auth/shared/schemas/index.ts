import * as z from 'zod'

export const emailSchema = z.email({ error: e => !e.input ? 'Email is required' : 'Invalid email address' }).max(255, { error: 'Email must not exceed 255 characters' }).lowercase()
export const plainPasswordSchema = z.string().min(8, { error: 'Password must be at least 8 characters' })
export const idSchema = z.coerce.number().positive()
