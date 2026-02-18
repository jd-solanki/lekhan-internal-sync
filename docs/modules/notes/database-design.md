# Notes Module — Database Design

> _Stores markdown notes with full-text search, user isolation, and position-based ordering._

**Module:** `notes`
**PostgreSQL Version:** 16+
**ORM Target:** Drizzle ORM
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Stores user-owned markdown notes with:
- Full-text search capability across title and content (<100ms requirement)
- Position-based ordering for drag-to-reorder functionality
- Strict user data isolation
- Auto-save support with timestamp tracking

### Module Boundary

**This module owns:**
- Note content (title, markdown body)
- Note organization (position within user's flat list)
- Full-text search index

**References from other modules:**
- `user` table from Auth module (note ownership)
- Subscription plan data from Payments module (enforced at application layer, not DB)

**Cross-module constraints:**
- Notes cannot exist without owning user
- Note count limits enforced by application layer based on subscription plan
- No database-level plan enforcement (business logic in API layer)

---

## Tables

### note

**Purpose:** Stores individual markdown notes owned by users with full-text search and ordering.

**Drizzle Schema Hint:** `public.note`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK, NOT NULL | Unique note identifier |
| user_id | INTEGER | FK(user.id), NOT NULL, INDEX | Owning user reference (from Auth module) |
| title | TEXT | NOT NULL, DEFAULT 'Untitled' | Note title (searchable) |
| content | TEXT | NOT NULL, DEFAULT '' | Markdown content (searchable, no HTML stored) |
| position | INTEGER | NOT NULL | Ordering position for drag-to-reorder (lower = higher in list) |
| search_vector | TSVECTOR | | Generated full-text search index from title + content |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Note creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last modification timestamp (auto-save tracking) |

**Business Rules:**
- Every note must have owning user (user_id NOT NULL)
- Title defaults to "Untitled" for instant note creation
- Content stored as markdown only (no HTML persisted)
- Position assigned sequentially on creation (application determines next position)
- No soft delete (permanent deletion per product requirements)
- search_vector automatically maintained via trigger or generated column

**Indexes (Semantic Intent):**
- PRIMARY KEY on `id` (automatic, unique note access)
- INDEX on `user_id` (critical for user note retrieval, every list operation filters by user)
- COMPOSITE INDEX on `(user_id, position ASC)` (optimizes ordered note list queries)
- GIN INDEX on `search_vector` (required for <100ms full-text search performance)
- UNIQUE INDEX on `(user_id, position)` (prevents position conflicts within user's list)

---

## Relationships

### User ↔ Note

**Type:** One-to-Many

**Implementation:**
- Foreign key: `note.user_id` references `user.id`
- Drizzle relation: `user` has many `notes`

**Cascade Rules:**
- ON DELETE: CASCADE (deleting user permanently deletes all their notes)
- ON UPDATE: CASCADE (if user.id changes, all note references update)

**Business Rules:**
- Note cannot exist without user (enforced by NOT NULL FK)
- User can have 0 to unlimited notes (plan limit enforced at application layer)
- All note operations must validate user_id matches authenticated session
- Cross-user note access strictly forbidden (enforced at API layer)

---

## Full-Text Search Implementation

### Search Vector Generation

**Purpose:** Enable sub-100ms full-text search across note titles and content.

**Implementation Strategy (Semantic Intent):**

PostgreSQL generated column or trigger to maintain `search_vector`:
- Combines `title` (weight A - higher relevance) and `content` (weight B - lower relevance)
- Uses `to_tsvector('english', ...)` for English language stemming
- Updates automatically on INSERT/UPDATE

**Example Trigger Logic (Semantic Description):**
```
BEFORE INSERT OR UPDATE on note:
  SET search_vector = 
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
```

**Search Query Pattern (Semantic):**
- Application queries: `WHERE user_id = ? AND search_vector @@ to_tsquery('english', ?)`
- GIN index enables fast tsvector matching
- Results ordered by relevance using `ts_rank(search_vector, query)`

**Performance Rationale:**
- GIN index on tsvector provides O(log n) search complexity
- Avoids LIKE queries which require full table scans
- Meets <100ms requirement even with 200+ notes per user

---

## Data Integrity Rules

### Referential Integrity

**Cross-Module References:**
- `note.user_id` → `user.id` (Auth module)
  - Business rule: User must exist before note creation
  - Cascade delete: Deleting user removes all notes permanently
  - No orphaned notes allowed

### Immutability Constraints

**None.** All note fields are mutable to support editing and auto-save functionality.

### Uniqueness Rules

- **note.id**: Global uniqueness (primary key)
- **note(user_id, position)**: Composite uniqueness ensures no duplicate positions within user's list
  - Prevents drag-to-reorder conflicts
  - Application must recalculate positions on reorder operations

### Validation Rules

**Application Layer Enforcement (Not DB Constraints):**
- **Title length**: Recommended max 255 characters (no DB constraint, enforced by UI)
- **Content size**: Warning at 90KB, block at 100KB (application layer)
- **Markdown validation**: Content must be valid markdown (no HTML tags persisted)
- **Plan limits**: Check user note count against subscription plan before INSERT (Starter: 50, Pro: 200, Max: unlimited)

**Why Application Layer:**
- Business rules may change per plan tier
- More flexibility than CHECK constraints
- Better error messages to users

### Position Management

**Business Rules:**
- Position values are integers (not floats or fractional indexing)
- Lower position = higher in list (position 1 appears above position 2)
- Positions need not be sequential (gaps allowed: 1, 5, 10, 100)
- On reorder: Application recalculates all affected positions in single transaction

**Reorder Strategy (Semantic):**
- Drag note from position X to position Y
- Application determines new position values for affected range
- Batch UPDATE in single transaction using temp position values to avoid UNIQUE constraint violations

---

## Entity Lifecycle

### Note Lifecycle

**States:** Notes have no explicit state field (all notes are "active").

**Lifecycle Events:**
- **Creation**: User creates note → INSERT with default title "Untitled", empty content, next position value
- **Editing**: User modifies title/content → UPDATE with new content, updated_at timestamp refreshed
- **Auto-Save**: Every 3s after typing stops → PATCH updates content, triggers updated_at refresh
- **Reorder**: User drags note → PATCH updates position values in batch
- **Deletion**: User deletes note → DELETE (permanent, no recovery)

**Immutable After:**
- None. All fields mutable throughout lifecycle.

**Deletion Rules:**
- Hard delete only (no soft delete, no trash, no deactivated_at)
- DELETE removes row permanently
- User confirmation required at application layer
- No recovery mechanism

---

## Indexes (Semantic Rationale)

**Purpose:** Document why each index exists from access pattern perspective.

- **note.id (PRIMARY KEY)**: Direct note access by ID (GET /api/notes/:id)
- **note.user_id**: Every query filters by user (strict data isolation) — all list/search operations
- **note(user_id, position ASC)**: Ordered note list retrieval (GET /api/notes with drag-to-reorder display)
- **GIN note.search_vector**: Full-text search requirement (<100ms across title + content)
- **UNIQUE note(user_id, position)**: Prevents position conflicts, enforces one note per position per user

**Performance Targets:**
- List all user notes: <50ms (covered by user_id + position composite index)
- Search notes: <100ms (covered by GIN index on search_vector)
- Fetch single note: <10ms (covered by primary key)

---

## Notes

### PostgreSQL-Specific Features Used

**TSVECTOR and Full-Text Search:**
- `search_vector` TSVECTOR column for indexed search
- GIN index on tsvector for fast full-text queries
- Generated column or trigger to maintain search_vector from title + content
- English language stemming via `to_tsvector('english', ...)`

**Why TSVECTOR over LIKE:**
- LIKE '%keyword%' requires full table scan (slow at scale)
- TSVECTOR with GIN index provides sub-100ms performance
- Supports stemming (search "running" matches "run", "runs")
- Relevance ranking via `ts_rank()`

**Triggers (Optional Implementation Detail):**
- May use BEFORE INSERT/UPDATE trigger to maintain search_vector
- Alternative: PostgreSQL generated column (cleaner, automatic)

### Drizzle ORM Considerations

**Schema Namespacing:**
- Table: `public.note` (default PostgreSQL schema)
- Variable name: `dbTableNote` (follows casing convention)

**Mixins Usage:**
- `...mixinId()` for `id` column
- `...mixinCreatedAt('createdAt', 'created_at')` for timestamp
- `...mixinUpdatedAt('updatedAt', 'updated_at')` for auto-updating timestamp
- Do NOT use `mixinDeletedAt` (no soft delete)

**Zod Validation:**
- Use drizzle-zod to generate runtime validators
- Schema names follow snake_case: `note_schema`, `new_note_schema`

**Relations:**
- Define bidirectional relation: `user` has many `notes`, `note` belongs to `user`
- Use Drizzle relations API for type-safe joins

**Generated Columns / Triggers:**
- `search_vector` requires custom SQL (not native Drizzle feature)
- Implement via raw SQL in migration file
- Document in migration as BEFORE INSERT/UPDATE trigger or GENERATED ALWAYS AS

### Implementation Notes for Schema Engineer

**Table Creation Order:**
1. `note` table references `user.id` (Auth module already exists)
2. Create table with all columns
3. Add indexes (PRIMARY KEY automatic, create user_id, composite, search_vector indexes)
4. Add full-text search trigger or generated column
5. Add foreign key constraint to `user.id` with CASCADE delete
6. Export table schema in central index

**Migration Checklist:**
- [ ] Define `dbTableNote` with proper column types
- [ ] Use mixins for id, created_at, updated_at
- [ ] Add user_id FK reference to dbTableUser
- [ ] Create indexes: user_id, (user_id, position), GIN(search_vector), UNIQUE(user_id, position)
- [ ] Add search_vector maintenance (trigger or generated column)
- [ ] Define Drizzle relations (note → user)
- [ ] Export from `server/db/schemas/tables/index.ts`
- [ ] Generate Zod schemas with drizzle-zod

**Example Table Variable Name:**
```typescript
export const dbTableNote = pgTable('note', { ... })
```

**Example Relation Definition:**
```typescript
export const dbTableNoteRelations = relations(dbTableNote, ({ one }) => ({
  user: one(dbTableUser, {
    fields: [dbTableNote.userId],
    references: [dbTableUser.id],
  }),
}))
```

### Future Considerations

**Scalability:**
- Current design supports thousands of notes per user efficiently
- If user count exceeds millions, consider partitioning by user_id
- search_vector GIN index scales well (tested to 100K+ documents)

**Potential Schema Evolution:**
- User requests tags/folders → Would require new tables (not modifying note table)
- Rich media support → Would require separate attachments table
- Sharing → Would require permissions/shares table
- Versioning → Would require note_versions table

**Performance Monitoring:**
- Track query performance on user_id + position composite index
- Monitor GIN index size and search performance as note count grows
- Watch for position conflicts during concurrent reorder operations

---

## Database Schema Code Reference

**File Location:** `layers/notes/server/db/schemas/tables/note.ts` (to be created)

**Example Implementation (Semantic Reference):**

```typescript
import { index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { mixinCreatedAt, mixinId, mixinUpdatedAt } from '~/layers/01.base/server/db/schemas/mixins'
import { dbTableUser } from '~/layers/auth/server/db/schemas/tables/user'

// Note table definition
export const dbTableNote = pgTable('note', {
  ...mixinId(),
  userId: integer('user_id')
    .notNull()
    .references(() => dbTableUser.id, { onDelete: 'cascade' }),
  title: text().notNull().default('Untitled'),
  content: text().notNull().default(''),
  position: integer().notNull(),
  // search_vector maintained by trigger (see migration SQL)
  searchVector: text('search_vector'), // Placeholder for tsvector
  ...mixinCreatedAt('createdAt', 'created_at'),
  ...mixinUpdatedAt('updatedAt', 'updated_at'),
}, table => [
  index('note_user_id_idx').on(table.userId),
  index('note_user_id_position_idx').on(table.userId, table.position.asc()),
  uniqueIndex('note_user_id_position_unique').on(table.userId, table.position),
  // GIN index on search_vector created in migration SQL
])

// Relations
export const dbTableNoteRelations = relations(dbTableNote, ({ one }) => ({
  user: one(dbTableUser, {
    fields: [dbTableNote.userId],
    references: [dbTableUser.id],
  }),
}))
```

**Migration SQL for Full-Text Search (Semantic Example):**

```sql
-- Add tsvector column (if not using Drizzle custom type)
ALTER TABLE note ADD COLUMN search_vector tsvector;

-- Create trigger function to maintain search_vector
CREATE OR REPLACE FUNCTION note_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to note table
CREATE TRIGGER note_search_vector_trigger
BEFORE INSERT OR UPDATE ON note
FOR EACH ROW EXECUTE FUNCTION note_search_vector_update();

-- Create GIN index on search_vector
CREATE INDEX note_search_vector_idx ON note USING GIN(search_vector);
```

**Central Export (schema/tables/index.ts):**

```typescript
// Add to existing exports
export * from '../../../../layers/notes/server/db/schemas/tables'
```

**Naming Convention Compliance:**
- Table name: `note` (snake_case)
- Variable: `dbTableNote` (follows dbTable{PascalCase} pattern)
- Columns: `user_id`, `search_vector`, `created_at`, `updated_at` (snake_case via casing config)
- Property names: `userId`, `searchVector`, `createdAt`, `updatedAt` (camelCase in TypeScript)

---
