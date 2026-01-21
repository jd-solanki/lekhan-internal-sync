import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '~~/server/db/schemas/tables'
import env from '~~/server/libs/env'
import 'dotenv/config'

// Docs: https://supabase.com/docs/guides/database/drizzle
const client = postgres(
  env.DATABASE_URL,
  {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    prepare: false,
  },
)

export const db = drizzle(client, {
  schema,
  logger: false,
  casing: 'snake_case',
})
