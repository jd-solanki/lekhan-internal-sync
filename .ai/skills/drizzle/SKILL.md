---
name: Drizzle ORM
description: Skills related to using Drizzle ORM for database interactions, including schema definitions, migrations, querying, and best practices for performance and maintainability.
---

## Database Design

- When using `JSONB` columns always specify type like `metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),`

## Query

- Prefer relational query pattern
- Use `Promise.all` for parallel queries. E.g. query records & counts
- Use `$count` over `count()` for minimal code with where clause

## Project Specific

- Tables via `dbTable<EntityInPascal>`, schemas via `dbSchema<EntityInPascal><Select|Insert|Update>` & type via `DB<Select|Insert><EntityInPascal>` are auto imported by nuxt
