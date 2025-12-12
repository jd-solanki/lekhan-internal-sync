import { defu } from 'defu'
import { outlineCardWOBorders } from '../layers/01.base/config/nuxt-ui'

export default defineAppConfig({
  app: {
    logoUrl: '/logo.svg',
    logoClass: 'dark:invert',
  },
  ui: defu({
    /* Write your config */
  }, outlineCardWOBorders),

  // Docs
  github: {
    url: 'https://github.com/LaunchDayOne/LaunchDayOne',
    branch: 'main',
  },
  socials: {
    x: 'https://x.com/me_jd_solanki',
    discord: 'https://discord.gg/xXPJRpnv',
  },
})
