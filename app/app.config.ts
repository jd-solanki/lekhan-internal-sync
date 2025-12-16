import { defu } from 'defu'
import { outlineCardWOBorders } from '../layers/01.base/config/nuxt-ui'

export default defineAppConfig({
  app: {
    logoUrl: '/logo.svg',
    logoClass: 'dark:invert', // For black & white logo in dark mode
  },
  ui: defu({
    /* Write your Nuxt UI config */
  }, outlineCardWOBorders),
})
