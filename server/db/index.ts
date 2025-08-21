import { drizzle } from 'drizzle-orm/node-postgres'
import env from '~~/shared/libs/env'
import * as schema from './schemas/tables'
import 'dotenv/config'

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production',
  },
  schema,
  logger: false,
  casing: 'snake_case',
})

export type DB = typeof db
export type DBTx = Parameters<Parameters<(DB)['transaction']>[0]>[0]
export type DBOrTx = DB | DBTx
