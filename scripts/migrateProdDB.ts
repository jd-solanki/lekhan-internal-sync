import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import env from '../server/libs/env'

async function runMigrations() {
  console.log('MIGRATIONS: Connecting to database...')

  const isProd = process.env.NODE_ENV === 'production'
  console.log(`MIGRATIONS: Running in ${isProd ? 'production' : 'development'} mode.`)

  // Use DIRECT_DATABASE_URL for migrations if set.
  // Migrations require a persistent direct connection and cannot run through
  // a connection pooler (like PgBouncer in transaction mode).
  // If DIRECT_DATABASE_URL is not set, falls back to DATABASE_URL —
  // which is fine for self-hosted or simple setups without a pooler.
  const migrationClient = postgres(env.DIRECT_DATABASE_URL || env.DATABASE_URL, {
    max: 1, // Max 1 connection for migrations
  })
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
