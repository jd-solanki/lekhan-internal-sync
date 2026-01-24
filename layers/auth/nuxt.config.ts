import type { NuxtPage } from 'nuxt/schema'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addMiddlewareToPage } from '../01.base/config/utils'
import { CRON_SCHEDULES_PRESET } from '../01.base/shared/utils/constants'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  hooks: {
    'pages:resolved': function (pages) {
      function setMiddleware(page: NuxtPage) {
        /*
          WARNING: Order matters here! So ensure private middleware is added first and admin afterwards
          So that while checking for admin, we are sure that user is already authenticated
        */

        // Handle public group
        if (page.meta?.groups?.includes('public')) {
          addMiddlewareToPage(page, 'public')
        }

        // Handle private group
        if (page.meta?.groups?.includes('private')) {
          addMiddlewareToPage(page, 'private')
        }

        // Handle guest group
        if (page.meta?.groups?.includes('guest')) {
          addMiddlewareToPage(page, 'guest')
        }

        // Handle admin group
        if (page.meta?.groups?.includes('admin')) {
          addMiddlewareToPage(page, 'admin')
        }
      }

      function processPages(pages: NuxtPage[]) {
        for (const page of pages) {
          setMiddleware(page)

          if (page.children) {
            processPages(page.children)
          }
        }
      }

      processPages(pages)
    },
  },
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
