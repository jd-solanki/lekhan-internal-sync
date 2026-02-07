import * as z from 'zod'

export const redirectUrlSchema = z.preprocess((val) => {
  if (typeof val === 'string')
    return decodeURIComponent(val)
  return val
}, z.string().startsWith('/'))

export type RedirectUrlSchema = z.infer<typeof redirectUrlSchema>
