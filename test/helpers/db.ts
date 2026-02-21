import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import * as schema from '../../server/db/schemas/tables'

const currentDir = dirname(fileURLToPath(import.meta.url))

export async function createTestDb() {
  const client = new PGlite()
  const db = drizzle({ client, schema, casing: 'snake_case' })

  await migrate(db, { migrationsFolder: resolve(currentDir, '../../server/db/migrations') })

  return db
}
