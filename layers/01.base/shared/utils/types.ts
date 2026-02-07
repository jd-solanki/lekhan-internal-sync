import type { IsEqual } from 'type-fest'

/**
 * Helper to create exhaustive arrays that must include all members of a union type.
 *
 * @example
 * type Provider = 'google' | 'github'
 * const providers = exhaustive<Provider>()([
 *   { id: 'google', name: 'Google' },
 *   { id: 'github', name: 'GitHub' }
 * ]) // ✅ Valid
 *
 * const incomplete = exhaustive<Provider>()([
 *   { id: 'google', name: 'Google' }
 * ]) // ❌ Type error: Must include all providers
 */
export function exhaustive<Union extends string>() {
  return <
    const Item extends { id: Union },
  >(
    arr: IsEqual<Union, Item['id']> extends true
      ? Item[]
      : ['Error: Must include all providers'],
  ) => arr
}
