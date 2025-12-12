import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * Composable that provides an `isLoading` ref and a wrapped function that
 * preserves the exact signature (args and return type) of the provided function.
 *
 * Example:
 *   const _sendVerificationEmail = async (email: string) => { ... }
 *   const { isLoading, fnWithLoading: sendVerificationEmail } = useWithLoading(_sendVerificationEmail)
 *
 *   await sendVerificationEmail('ada@example.com')
 */
export function useWithLoading<Args extends any[], R>(
  fn: (...args: Args) => R | Promise<R>,
): { isLoading: Ref<boolean>, fnWithLoading: (...args: Args) => Promise<R> } {
  const isLoading = ref(false)
  const fnWithLoading = createWithLoadingFor<Args, R>(isLoading, fn)
  return { isLoading, fnWithLoading }
}
