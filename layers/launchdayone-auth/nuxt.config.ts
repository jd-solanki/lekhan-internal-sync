import { CRON_SCHEDULES_PRESET } from '../launchdayone-core/shared/utils/constants'

export default defineNuxtConfig({
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      [CRON_SCHEDULES_PRESET.EVERY_DAY]: ['liftBan'],
    },
  },
})
