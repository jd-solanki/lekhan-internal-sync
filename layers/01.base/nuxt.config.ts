import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  css: [
    join(currentDir, './app/assets/css/transitions.css'),
  ],
  imports: {
    dirs: [
      'shared/schemas/**', // Shared schemas
    ],
  },
  nitro: {
    imports: {
      dirs: [
        'shared/schemas/**/*', // Shared schemas
        'server/utils/**/*', // Server utils
      ],
    },
  },
})
