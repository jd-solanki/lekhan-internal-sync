export function useVersionUpdated() {
  const isNewVersionAvailable = ref(false)
  const nuxtApp = useNuxtApp()
  nuxtApp.hooks.hookOnce('app:manifest:update', () => {
    isNewVersionAvailable.value = true
  })

  return { isNewVersionAvailable: readonly(isNewVersionAvailable) }
}
