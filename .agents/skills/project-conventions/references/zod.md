# Zod Conventions

## Schema Generation from Drizzle

Use `drizzle-zod` to generate Zod schemas from Drizzle table definitions instead of manually recreating schemas:

```typescript
// ❌ Avoid - Manual schema duplication
import { z } from 'zod'
import { dbTableUsers } from '~/server/db/schemas'

// Recreating table structure manually
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
})

// ✅ Good - Generate from Drizzle with proper naming (dbSchema<Entity><Select|Insert|Update>)
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTableUsers } from '~/server/db/schemas'

export const dbSchemaUsersSelect = createSelectSchema(dbTableUsers)
export const dbSchemaUsersInsert = createInsertSchema(dbTableUsers)
export const dbSchemaUsersUpdate = createUpdateSchema(dbTableUsers)
```

## Common Patterns

```typescript
// Full select schema (all fields as returned from DB) - Pattern: dbSchema<Entity>Select
export const dbSchemaUsersSelect = createSelectSchema(dbTableUsers)

// Full insert schema (required fields) - Pattern: dbSchema<Entity>Insert
export const dbSchemaUsersInsert = createInsertSchema(dbTableUsers)

// Update schema (specific fields) - Pattern: dbSchema<Entity>Update
export const dbSchemaUsersUpdate = createUpdateSchema(dbTableUsers)

// Pick specific fields from generated schema
export const dbSchemaUsersSelectEmail = dbSchemaUsersSelect.pick({ email: true })
```

## Naming Convention

Follow the project eslint rules for schema naming:

- `dbSchema<Entity>Select` - For `createSelectSchema(dbTable<Entity>)`
- `dbSchema<Entity>Insert` - For `createInsertSchema(dbTable<Entity>)`
- `dbSchema<Entity>Update` - For `createUpdateSchema(dbTable<Entity>)`

Table names follow `dbTable<Entity>` convention. See eslint rules for enforcement.

## Benefits

- **Single source of truth**: Schema always matches table definition
- **Type safety**: Zod schemas and TypeScript types stay in sync
- **Consistency**: Enforced naming convention via eslint rules
- **Less code**: Eliminates manual schema duplication
- **Maintenance**: Table changes automatically flow to schemas

**Rationale**: Manually maintaining schemas creates drift between database, types, and validation logic. Drizzle-zod eliminates this problem entirely.
