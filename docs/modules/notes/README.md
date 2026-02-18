# Notes Module

Manages note creation, editing, organization, and storage for authenticated users.

## Responsibility

> _Defines precisely what this module owns. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Create, edit, and delete markdown notes with rich text visual editor
- Auto-save note content every 3 seconds without user action
- Search across all user's notes with sub-100ms response time
- Organize notes in flat list with drag-to-reorder capability
- Enforce note limits based on user's subscription plan (Starter: 50, Pro: 200, Max: unlimited)
- Store notes as markdown-only content (no HTML in database)
- Ensure strict user data isolation (users only access their own notes)

## Domain Model

> _Defines entities this module owns and their relationships at a conceptual level. Focus on WHAT entities represent, not implementation details._

### Entities

**Note**: A markdown document owned by a user, stored as markdown text in DB (not Nuxt Content filesystem), edited through UEditor (TipTap-based, content-type="markdown") with MDC component for read-only preview rendering

### Relationships

**Within Module:**

- **Note** → **Note**: Notes have position/order within user's flat list for drag-to-reorder functionality (self-referential ordering)

**Cross-Module Integration:**

- **Auth Module**: Notes are owned by users; module validates user identity and enforces strict ownership (userId verification on all operations)
- **Payments Module**: User's subscription plan determines maximum note count; module checks plan limits before allowing note creation

### Business Rules & Invariants

> _Key domain constraints that define this module's behavior. High-level rules only - implementation details belong in detailed specs._

- Users can only access their own notes (strict user isolation enforced at API and database layers)
- Note content stored as markdown only (no HTML persisted to database)
- Auto-save triggers every 3 seconds after user stops typing
- Search must complete within 100ms perceived latency
- Notes deleted permanently with no recovery (no trash, no soft delete)
- Notes organized in flat list only (no folders, tags, or hierarchical categorization)
- Note limit enforcement: Cannot create new note if at plan limit, but existing notes always accessible
- Note creation requires active subscription (trial or paid)
- Drag-to-reorder preserves user's chosen note order in sidebar

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **Base Module**: Database schemas, utilities, composables, Nuxt Content configuration, and shared infrastructure
- **Auth Module**: Session validation and userId verification required for all note operations (enforces ownership)
- **Payments Module**: Subscription plan checking to enforce note limits before creation (Starter: 50, Pro: 200, Max: unlimited)

**Depended on by:**

- _Currently no modules depend on Notes module (may change as product evolves)_

**Integration Contract:**

- External modules must not access note content directly; all access through this module's API endpoints
- Module enforces userId ownership verification before returning note data
- Module checks subscription plan limits via Payments module before allowing note creation
- Auth module provides authenticated userId for all operations

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section._

**Core Interaction Principles:**

- **Instant capture**: Note creation feels immediate with no loading delays or perceived latency
- **Auto-save transparency**: Visual feedback shows when content is being saved and when save completes (every 3 seconds after typing stops)
- **Distraction-free editing**: Minimal interface during writing sessions — full-screen markdown editor with rich text visual controls
- **Fast search**: Find any note instantly with search results appearing as user types (<100ms)
- **Flat simplicity**: No folders or tags to manage — notes appear in flat sidebar list with drag-to-reorder
- **Plan limit guidance**: When approaching or hitting note limit, show clear upgrade prompt without blocking access to existing notes
- **Permanent deletion**: Confirm before deleting; once deleted, note is gone forever (no recovery option)

**Page-Level Documentation:**

- Detailed page specs: `docs/modules/notes/frontend/pages/`

## Frontend Pages

> _User-facing pages this module provides. Detailed specs live in `frontend/pages/` subdirectories._
>
> _**SEO & Routing Convention**: Use semantic, descriptive URLs following Nuxt's filesystem-based routing. URLs should reflect page purpose and create logical hierarchy for both users and search engines._

**URL Hierarchy Design Principles:**

- Use semantic, descriptive paths that communicate page purpose
- Follow Nuxt filesystem routing conventions (directory structure = URL structure)
- Keep URLs short but meaningful (2-3 levels max for this module)
- Use hyphens for multi-word segments: `/my-notes` not `/my_notes`
- Dynamic parameters in brackets: `[id]` for note identifier
- Reflect parent-child relationships: `/notes/[id]` shows note detail is child of notes collection

**Nuxt Filesystem Routing Reference:**

- `pages/notes/index.vue` → `/notes`
- `pages/notes/[id].vue` → `/notes/:id`

**Pages:**

- **/notes**: Main notes list view — displays all user's active notes in sidebar with search bar and drag-to-reorder capability — **Filesystem**: `pages/notes/index.vue`
- **/notes/[id]**: Individual note editor page — full-screen markdown editor with Nuxt UI Editor for visual rich text editing and auto-save — **Filesystem**: `pages/notes/[id].vue`

**SEO Considerations:**

- Use descriptive path `/notes` to clearly indicate notes collection
- Dynamic segment `[id]` allows unique identifier for each note: `/notes/abc123def`
- Flat URL structure (only 2 levels) reflects flat note organization (no folders/hierarchy)
- Private pages behind authentication (no SEO indexing needed, use `robots: { index: false }`)

**Detailed Specs:**

- Each page documented in `docs/modules/notes/frontend/pages/[page-path]/README.md`
- Example: `docs/modules/notes/frontend/pages/index/README.md` for `/notes`
- Example: `docs/modules/notes/frontend/pages/[id]/README.md` for `/notes/:id`

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients. Detailed specs live in `backend/api/` subdirectories._

**Endpoints:**

- **POST /api/notes**: Create new note for authenticated user (enforces plan limit before creation)
- **GET /api/notes**: List all user's notes with metadata (title, created, updated, position)
- **GET /api/notes/:id**: Fetch specific note content and metadata (validates ownership)
- **PATCH /api/notes/:id**: Update note title or markdown content (triggers auto-save)
- **DELETE /api/notes/:id**: Permanently delete note (no recovery, confirms ownership)
- **PATCH /api/notes/reorder**: Update note positions for drag-to-reorder (batch update)

**Detailed Specs:**

- Each endpoint documented in `docs/modules/notes/backend/api/[route]/[method]/README.md`
- Example: `docs/modules/notes/backend/api/notes/post/README.md` for `POST /api/notes`
- Example: `docs/modules/notes/backend/api/notes/[id]/get/README.md` for `GET /api/notes/:id`
- Example: `docs/modules/notes/backend/api/notes/[id]/patch/README.md` for `PATCH /api/notes/:id`
- Example: `docs/modules/notes/backend/api/notes/[id]/delete/README.md` for `DELETE /api/notes/:id`
- Example: `docs/modules/notes/backend/api/notes/reorder/patch/README.md` for `PATCH /api/notes/reorder`

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Note**: Single markdown document owned by user, stored as text in PostgreSQL database (DB is source of truth, not filesystem)
- **Auto-save**: Automatic persistence of note content every 3 seconds after user stops typing, with visual feedback
- **Flat list**: Single-level organization where all notes appear in sidebar without folders, tags, or hierarchical structure
- **Drag-to-reorder**: User interaction allowing notes to be repositioned in sidebar by dragging to desired position
- **Note limit**: Maximum number of notes user can create based on subscription plan (Starter: 50, Pro: 200, Max: unlimited)
- **Rich text editor**: UEditor from @nuxt/ui — TipTap-based editor in markdown mode. Sub-components: UEditorToolbar (fixed + bubble), UEditorSuggestionMenu (slash commands), UEditorDragHandle (block reordering). Preview via MDC from @nuxtjs/mdc
- **Permanent deletion**: Note deletion is immediate and irreversible with no trash/archive storage

_Product-wide terms (User, Plan, Auto-Save) defined in product README._

## Phase-3 Candidates

> _Features deferred to future phases to keep scope focused._

- **Image upload**: Upload and embed images in notes via S3/storage
- **@ Mentions**: Tag other users via UEditorMentionMenu (requires collaboration features)
- **AI completion**: AI-powered writing suggestions and auto-complete
- **Table support**: TipTap table extension for structured data in notes
- **Collaborative editing**: Real-time multi-user editing via Y.js/Hocuspocus

## Notes for Future AI Agents

- **This document defines module-level WHAT, never HOW**
- **All module behavioral truth flows from here**
- **Module must respect product README authority (higher in hierarchy)**
- **If product README contradicts this, product README wins**
- **Frontend pages and API endpoints listed here are high-level overviews**
- **Detailed page/API specs live in subdirectories, not here**
- **Implementation may change; domain semantics must not**
- **Notes stored as markdown text in PostgreSQL — DB is source of truth, not Nuxt Content filesystem**
- **UEditor (TipTap, markdown mode) + MDC for preview — saves markdown only**
- **Strict user data isolation enforced at all layers**
- **Plan limit checks happen before note creation, not after**
- **Search performance (<100ms) is non-negotiable per product philosophy**
