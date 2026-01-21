import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import env from '../server/libs/env'

async function runMigrations() {
  console.log('MIGRATIONS: Connecting to database...')

  // Max 1 connection for migrations
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 })
  const db = drizzle(migrationClient)

  try {
    console.log('MIGRATIONS: Starting...')
    await migrate(db, { migrationsFolder: 'server/db/migrations' })
    console.log('MIGRATIONS: Completed successfully!')
  }
  catch (error) {
    console.error('MIGRATIONS: Failed.', error)
    process.exit(1)
  }
  finally {
    console.log('MIGRATIONS: Closing connection...')
    await migrationClient.end()
  }
}

runMigrations()
