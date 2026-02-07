import { serial, timestamp } from 'drizzle-orm/pg-core'

/*
Best Practices:
- Always provide dbColName along with propertyName.
  This is because dbColName is fallback to propertyName if not provided and might not respect naming conventions.
  E.g. using `...mixinCreatedAt('addedAt')` will have property name and database col name `addedAt` however you might prefer `added_at` as database column name.
*/

export function mixinId<T extends string = 'id'>(
  propertyName: T = 'id' as T,
  dbColName?: string,
) {
  const columnName = dbColName || propertyName
  const column = serial(columnName).primaryKey().notNull()
  return {
    [propertyName]: column,
  } as Record<T, typeof column>
}

export function mixinCreatedAt<T extends string>(
  propertyName: T,
  dbColName: string,
) {
  const column = timestamp(dbColName, { withTimezone: true }).notNull().defaultNow()
  return {
    [propertyName]: column,
  } as Record<T, typeof column>
}

export function mixinUpdatedAt<T extends string>(
  propertyName: T,
  dbColName: string,
) {
  const column = timestamp(dbColName, { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
  return {
    [propertyName]: column,
  } as Record<T, typeof column>
}

export function mixinDeletedAt<T extends string>(
  propertyName: T,
  dbColName: string,
) {
  const column = timestamp(dbColName, { withTimezone: true })
  return {
    [propertyName]: column,
  } as Record<T, typeof column>
}
