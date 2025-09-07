import type { Config } from '@maizzle/framework'

// @ts-expect-error We're importing .ts files
import env from '../shared/libs/env.ts'

export default {
  baseURL: env.APP_BASE_URL,
  server: {
    port: 7000,
  },
  components: {
    root: './emails',
  },
  build: {
    content: ['emails/**/*.html'],
    static: {
      source: ['images/**/*.*'],
      destination: 'images',
    },
  },
  locals: {
    env,
  },
} satisfies Config
