import { CRON_SCHEDULES_PRESET } from '../base/shared/utils/constants'

export default defineNuxtConfig({
  icon: {
    customCollections: [
      {
        prefix: 'arrows',
        dir: './app/assets/icons/arrows',
      },
    ],
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      [CRON_SCHEDULES_PRESET.EVERY_DAY]: ['liftBan'],
    },
    imports: {
      dirs: [
        'server/utils/**/*', // Server utils
        'shared/schemas/**/*', // Shared schemas
      ],
    },
  },
  imports: {
    dirs: [
      '../shared/schemas/**', // Shared schemas
    ],
  },
})
