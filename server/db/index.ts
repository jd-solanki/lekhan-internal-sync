import env from '~~/layers/launchdayone-core/shared/libs/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schemas/tables'
import 'dotenv/config'

const client = postgres(
  env.DATABASE_URL,
  {
    // ssl: env.NODE_ENV === 'production',
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // ssl: false,
    // ssl: 'require'

    // Disable prefetch as it is not supported for "Transaction" pool mode
    prepare: false,
  },
)

export const db = drizzle(client, {
  schema,
  logger: false,
  casing: 'snake_case',
})

export type DB = typeof db
export type DBTx = Parameters<Parameters<(DB)['transaction']>[0]>[0]
export type DBOrTx = DB | DBTx
