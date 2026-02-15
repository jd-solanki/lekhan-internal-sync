import type { InternalApi } from 'nitropack/types'
import type { FetchOptions } from 'ofetch'
import type {} from '../../../.nuxt/types/nitro-routes'
import { $fetch } from 'ofetch'

const port = process.env.NUXT_PORT || 3000

export async function apiFetch(
  path: keyof InternalApi,
  options?: FetchOptions,
) {
  return $fetch.create({
    baseURL: `http://localhost:${port}`,
  })(path as string, options)
}
