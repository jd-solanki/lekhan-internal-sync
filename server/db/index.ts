import * as schema from '#server/db/schemas/tables'
import env from '#server/libs/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

// Docs: https://supabase.com/docs/guides/database/drizzle
// DATABASE_URL should point to your connection pooler if available.
// Connection poolers (like PgBouncer) reuse database connections efficiently,
// which is important in serverless environments where each request may
// spin up a new process and naively open a new DB connection.
// `prepare: false` is required when using PgBouncer in transaction mode.
const client = postgres(
  env.DATABASE_URL,
  {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    prepare: false,
  },
)

export const db = drizzle({
  client,
  schema,
  logger: false,
  casing: 'snake_case',
})
