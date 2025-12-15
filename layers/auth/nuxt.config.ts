import { CRON_SCHEDULES_PRESET } from '../01.base/shared/utils/constants'

export default defineNuxtConfig({
  icon: {
    customCollections: [
      {
        prefix: 'arrows',
        dir: 'layers/auth/app/assets/icons/arrows', // Requires path from root dir
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
      'libs/auth', // authClient
      '../shared/schemas/**', // Shared schemas
    ],
  },
})
