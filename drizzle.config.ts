import env from '~~/layers/launchdayone-core/shared/libs/env'
import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  schema: './server/db/schemas/tables/',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: false,
  strict: true,
  casing: 'snake_case',
})
