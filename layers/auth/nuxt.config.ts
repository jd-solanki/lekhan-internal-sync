import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CRON_SCHEDULES_PRESET } from '../01.base/shared/utils/constants'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  icon: {
    customCollections: [
      {
        prefix: 'arrows',
        dir: join(currentDir, './app/assets/icons/arrows'),
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
