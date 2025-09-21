import { describe, expect, expectTypeOf, it } from 'vitest'
import { nextTick } from 'vue'
import { useWithLoading } from '../app/composables/useWithLoading'

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

describe('useWithLoading', () => {
  describe('runtime behavior', () => {
    it('toggles isLoading during async function and returns result', async () => {
      // Create composable with an async function; verify isLoading is true inside
      let seenTrueInside = false
      const { isLoading, fnWithLoading } = useWithLoading(async (x: number) => {
        seenTrueInside = isLoading.value
        await wait(5)
        return x * 2
      })

      expect(isLoading.value).toBe(false)
      const result = await fnWithLoading(5)
      expect(result).toBe(10)
      expect(seenTrueInside).toBe(true)
      // ensure it settles back to false
      await nextTick()
      expect(isLoading.value).toBe(false)
    })

    it('resets isLoading to false when the function throws', async () => {
      const { isLoading, fnWithLoading } = useWithLoading(async () => {
        await wait(1)
        throw new Error('boom')
      })

      await expect(fnWithLoading()).rejects.toThrow('boom')
      expect(isLoading.value).toBe(false)
    })
  })

  describe('type inference', () => {
    it('preserves argument and return types of the original function', () => {
      const { fnWithLoading: _fnWithLoading } = useWithLoading(async (a: number, _b?: { x: string }) => {
        return a
      })

      // Parameters are preserved
      expectTypeOf<Parameters<typeof _fnWithLoading>>().toEqualTypeOf<[
        number,
        { x: string }?,
      ]>()
      // Return type is preserved (wrapped in Promise)
      expectTypeOf<ReturnType<typeof _fnWithLoading>>().toEqualTypeOf<Promise<number>>()
    })
  })
})
