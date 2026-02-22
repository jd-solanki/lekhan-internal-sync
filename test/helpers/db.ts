import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import * as dbRelations from '../../server/db/schemas/relations'
import * as dbTables from '../../server/db/schemas/tables'

const currentDir = dirname(fileURLToPath(import.meta.url))

const schema = {
  ...dbTables,
  ...dbRelations,
}

export async function createTestDb() {
  const client = new PGlite()
  const db = drizzle({ client, schema, casing: 'snake_case' })
  const migrationsFolder = resolve(currentDir, '../../server/db/migrations')
  await migrate(db, { migrationsFolder })

  return db
}
