import type { BannerProps } from '@nuxt/ui'

export const useBannerStore = defineStore('banner', () => {
  const props = reactive<BannerProps>({})

  return {
    props,
  }
})
