import { defineConfig } from 'drizzle-kit'
import env from '~~/server/libs/env'
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
