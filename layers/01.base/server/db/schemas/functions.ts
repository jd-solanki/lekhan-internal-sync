import type { SQL } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`
}
