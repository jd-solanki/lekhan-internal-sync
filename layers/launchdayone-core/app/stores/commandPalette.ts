import type { CommandPaletteGroup } from '@nuxt/ui'

export const useCommandPalette = defineStore('commandPalette', () => {
  const _pageActions = ref<CommandPaletteGroup['items']>([])
  const setPageActions = (actions: CommandPaletteGroup['items'] | undefined) => {
    onMounted(() => {
      _pageActions.value = actions || []
    })

    onBeforeUnmount(() => {
      _pageActions.value = []
    })
  }

  return {
    _pageActions,
    setPageActions,
  }
})
