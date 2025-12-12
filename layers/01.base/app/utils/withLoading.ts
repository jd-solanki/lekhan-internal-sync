import type { Ref } from 'vue'

/**
 * Create a scoped withLoading helper for a boolean Ref.
 * It toggles `loadingRef.value` to true before running the given function and
 * guarantees it is reset to false in a finally block, preserving the function's
 * return type and error behavior.
 *
 * 100% type-safe: the returned helper preserves the return type of the function you pass.
 *
 * Example (no-arg wrapper):
 *
 *   import { ref } from 'vue'
 *   import { createWithLoading } from '~/utils/withLoading'
 *
 *   const isAuthInProgress = ref(false)
 *   const withLoading = createWithLoading(isAuthInProgress)
 *
 *   // Usage matches the requested shape
 *   await withLoading(async () => {
 *     await authClient.sendVerificationEmail({ email })
 *   })
 *
 *   // It also returns values if your function returns something
 *   const user = await withLoading(async () => {
 *     return await authClient.useSession(useFetch)
 *   })
 */
export function createWithLoading(loadingRef: Ref<boolean>) {
  return async function withLoading<T>(fn: () => T | Promise<T>): Promise<T> {
    loadingRef.value = true
    try {
      return await fn()
    }
    finally {
      loadingRef.value = false
    }
  }
}

/**
 * Wrap any function (with arguments) so it toggles the given boolean Ref
 * to indicate loading while the function runs. Preserves both parameter types
 * and return type of the original function.
 *
 * 100% type-safe: Args and return type are inferred from `fn`.
 *
 * Example (preserve function signature):
 *
 *   const isAuthInProgress = ref(false)
 *   const sendVerificationEmail = createWithLoadingFor(
 *     isAuthInProgress,
 *     authClient.sendVerificationEmail,
 *   )
 *
 *   await sendVerificationEmail({ email })
 *
 * Example (custom function with multiple args):
 *
 *   async function fetchUser(id: string, expand?: boolean) {
 *     // ...
 *     return { id, name: 'Ada' }
 *   }
 *   const fetchUserWithLoading = createWithLoadingFor(isAuthInProgress, fetchUser)
 *
 *   const user = await fetchUserWithLoading('123', true)
 */
export function createWithLoadingFor<Args extends any[], R>(loadingRef: Ref<boolean>, fn: (...args: Args) => R | Promise<R>) {
  return async (...args: Args): Promise<R> => {
    loadingRef.value = true
    try {
      // eslint-disable-next-line prefer-spread
      return await Promise.resolve(fn.apply(undefined, args))
    }
    finally {
      loadingRef.value = false
    }
  }
}
