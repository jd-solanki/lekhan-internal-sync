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

// ✅ Good - Generate from Drizzle with proper naming (dbSchema<Operation><Entity>)
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTableUsers } from '~/server/db/schemas'

export const dbSchemaSelectUsers = createSelectSchema(dbTableUsers)
export const dbSchemaInsertUsers = createInsertSchema(dbTableUsers)
export const dbSchemaUpdateUsers = createUpdateSchema(dbTableUsers)
```

## Common Patterns

```typescript
// Full select schema (all fields as returned from DB) - Pattern: dbSchemaSelect<Entity>
export const dbSchemaSelectUsers = createSelectSchema(dbTableUsers)

// Full insert schema (required fields) - Pattern: dbSchemaInsert<Entity>
export const dbSchemaInsertUsers = createInsertSchema(dbTableUsers)

// Update schema (specific fields) - Pattern: dbSchemaUpdate<Entity>
export const dbSchemaUpdateUsers = createUpdateSchema(dbTableUsers)

// Public API schema extracted from db schema - place in shared/schemas/db.ts
export const publicSchemaCreateUsers = dbSchemaInsertUsers.pick({ name: true, email: true }).required()
export const publicSchemaUpdateUsers = dbSchemaUpdateUsers.pick({ name: true, email: true }).partial()

// Pick specific fields from generated schema
export const dbSchemaSelectUsersEmail = dbSchemaSelectUsers.pick({ email: true })
```

## Naming Convention

Follow the project eslint rules for schema naming:

- `dbSchemaSelect<Entity>` - For `createSelectSchema(dbTable<Entity>)`
- `dbSchemaInsert<Entity>` - For `createInsertSchema(dbTable<Entity>)`
- `dbSchemaUpdate<Entity>` - For `createUpdateSchema(dbTable<Entity>)`
- `publicSchema<Operation><Entity>` - For public schemas extracted from db schemas via zod chains

## Placement Convention

- Keep drizzle-generated db schemas in `shared/schemas/db/*`
- Keep db-derived public schemas in `shared/schemas/db.ts`
- Do not place db-derived public schemas in separate `note.ts`, `auth.ts`, etc. files

Table names follow `dbTable<Entity>` convention. See eslint rules for enforcement.

## Benefits

- **Single source of truth**: Schema always matches table definition
- **Type safety**: Zod schemas and TypeScript types stay in sync
- **Consistency**: Enforced naming convention via eslint rules
- **Less code**: Eliminates manual schema duplication
- **Maintenance**: Table changes automatically flow to schemas

**Rationale**: Manually maintaining schemas creates drift between database, types, and validation logic. Drizzle-zod eliminates this problem entirely.
