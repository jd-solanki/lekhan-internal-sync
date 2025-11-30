import type { BannerProps } from '@nuxt/ui'

// You can persist this as well with help of cookie
// Update code as per your business requirements
export const useBannerStore = defineStore('banner', () => {
  const props = reactive<BannerProps>({})

  return {
    props,
  }
})
