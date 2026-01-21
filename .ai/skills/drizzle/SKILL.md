---
name: Drizzle ORM
description: Skills related to using Drizzle ORM for database interactions, including schema definitions, migrations, querying, and best practices for performance and maintainability.
---

## Database Design

- When using `JSONB` columns always specify type like `metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),`
