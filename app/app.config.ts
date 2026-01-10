import { defu } from 'defu'
import { outlineCardWOBorders } from '../layers/01.base/config/nuxt-ui'

export default defineAppConfig({
  app: {
    logo: '/logo.png',
  },
  ui: defu({
    /* Write your Nuxt UI config */
  }, outlineCardWOBorders),
})
