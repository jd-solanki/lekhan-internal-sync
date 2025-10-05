import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

// INFO: We're not using parsed env because this script runs in GH Actions or even in other context don't require all env vars.

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.')
  }

  console.log('MIGRATIONS: Connecting to database...')

  // Create a new pool instance for the migration.
  // This is separate from your main application pool.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: process.env.NODE_ENV === 'production', // Match your app's SSL setting
    ssl: true,
  })

  const db = drizzle(pool)

  try {
    console.log('MIGRATIONS: Starting...')

    await migrate(db, { migrationsFolder: '../server/db/migrations' })

    console.log('MIGRATIONS: Completed successfully!')
  }
  catch (error) {
    console.error('MIGRATIONS: Failed.', error)
    process.exit(1) // Exit with a failure code
  }
  finally {
    console.log('MIGRATIONS: Closing connection...')
    await pool.end() // Ensure the connection is closed
  }
}

runMigrations()
