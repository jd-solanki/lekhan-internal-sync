// Taken from: https://github.com/danielkellyio/vitest-nuxt-api-tests-example/blob/main/test/utils/fetch.ts
import { describe, expect, it } from 'vitest'
import { apiFetch } from './utils/fetch'

describe('health.get', async () => {
  it('should return status ok with timestamp', async () => {
    const response = await apiFetch('/api/health')
    expect(response).toEqual({ status: 'ok', timestamp: expect.any(String) })
  })
})
