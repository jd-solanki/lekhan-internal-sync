# Lekhan

> _A simple note taking app._

## Vision Statement

Light weight & easy to use note taking experience but with a focus on speed and simplicity. The goal is to help users capture and organize their thoughts instantly without any complexity or friction using markdown.

## Primary Users

**Example:**

- **Students**: Take class notes and organize study materials
- **Writers**: Capture ideas and draft content quickly

**NOT for:**

**Teams:** Enterprise teams needing advanced permissions, collaboration and audit logs

## Core Value Proposition

1. **Notion like Experience**: Write and organize notes in markdown with a clean, intuitive interface
2. **Zero organization overhead**: No nested notes to organize. Adding new notes auto add them to sidebar. Just write and find them later with search or sidebar navigation.
3. **Simple & Elegant note taking experience without complexity**: Focus on core note-taking features without overwhelming users with advanced formatting, collaboration, or project management tools.

## Product Boundaries

- Create and edit text notes
- Auto notes organization in sidebar with custom ordering
- Search across all notes
- User authentication and account management

### Out of Scope

- Real-time collaboration between users
- Rich media embedding (videos, audio)
- Version history and change tracking
- Built-in project management features
- Sharing notes with other users

**Why excluded:**  
We focus on individual note-taking. Collaboration requires different UX patterns and increases complexity. Users needing collaboration should use dedicated team tools.

## Technology Stack

**Platform:**

- Web App and mobile app or PWA in future, but we will start with web app first. API should be independent of frontend framework so we can easily add mobile app or PWA in future without changing API layer.

**Primary Technologies:**

- **Nuxt**: Full stack framework for building web applications with Vue.js. Provides server-side rendering, static site generation, and powerful module ecosystem.
- **Nuxt UI**: Component library for building consistent and reusable UI across the application.
**Nuxt UI Editor Component**: Notion-like markdown editor component for creating and editing notes with rich formatting options.
- **Postgres**: For relational data storage, user accounts, notes metadata, etc. No browser database like IndexedDB or localStorage since we want a consistent experience across devices and sessions with server-side data persistence.

**Example:**

- **Platform**: Web application (browser-based)
- **Language**: TypeScript
- **Runtime**: Node.js (backend), Browser (frontend)
- **Database**: PostgreSQL
- **Storage**: AWS S3 for file uploads
- **Authentication**: Auth0

**Constraints:**

- Requires active internet connection (online-only app)
- Must run on low-spec devices (limit bundle size)

## Modules Overview

> _Lists all bounded contexts (modules) in this product, their responsibilities, and dependencies. Helps AI understand product structure and navigate to detailed module documentation._

### Base (Not documented ATM, kindly read the relevant code for now at `layers/01.base/`)

**Responsibility:** Reusable foundational code and utilities shared across modules & projects (e.g. components, helper functions, etc.). Basically everything that is not domain-specific, used by multiple modules, and can be reused in future projects.
**Key Capabilities:** Shared UI components (buttons, inputs, modals), common layouts, utility functions (date formatting, validation), shared styles/themes, etc.
**Path:** `/docs/modules/base/`

### Layouts (Not documented ATM, kindly read the relevant code for now at `layers/02.layouts/`)

**Responsibility:** Provides common page layouts and structural components that define the overall look and feel of the application. These are higher-level than base components and are used to compose the actual pages in the frontend layer. This may include non-domain specific layouts because this is also shared across multiple modules and projects.
**Key Capabilities:** Header, footer, sidebar, grid system, responsive design patterns, etc.
**Path:** `/docs/modules/layouts/`

### Auth (Not documented ATM, kindly read the relevant code for now at `layers/auth/`)

**Responsibility:** Handles user authentication, registration, and account management. Provides APIs for login, logout, password reset, and user profile management. This module is foundational for any user-specific features in the product.
**Key Capabilities:** User registration, login/logout, password reset, session management, user profile management, etc.
**Path:** `/docs/modules/auth/`

### Email (Not documented ATM, kindly read the relevant code for now at `layers/email/`)

**Responsibility:** Handles email-related functionalities such as verification emails, password resets, and other user communications. This module is foundational for any email-based features in the product. No email tracking or marketing emails are handled by this module, it's purely for transactional emails related to user accounts and authentication with email templates & utilities to send emails.
**Key Capabilities:** Sending transactional emails, email templates, etc.
**Path:** `/docs/modules/email/`

### Payments (Not documented ATM, kindly read the relevant code for now at `layers/payments/`)

**Responsibility:** Handles payment-related functionalities such as processing transactions, managing subscriptions, and handling billing information. This module is foundational for any payment-based features in the product.
**Key Capabilities:** Payment processing, subscription management, billing information management, etc.
**Path:** `/docs/modules/payments/`

### Website (Not documented ATM, kindly read the relevant code for now at `layers/website/`)

**Responsibility:** Module to frontend of our app involving landing page, marketing pages, and any non-authenticated user-facing pages. This module is separate from the main app frontend to keep marketing and product codebases isolated.
**Key Capabilities:** Landing page, marketing pages, etc.
**Path:** `/docs/modules/website/`

### Notes

**Responsibility:** Handles note-related functionalities such as creating, editing, deleting, and organizing notes. This module is foundational for any note-based features in the product.
**Key Capabilities:** Note creation, editing, deletion, auto organization, etc.
**Path:** `/docs/modules/notes/`

---

## Module Dependencies

> _Defines relationships between modules. Helps AI understand data flow and integration points. Prevents circular code dependencies while allowing bidirectional data relationships._

**Dependency Graph:**

```MERMAID
graph TD
    Base[Base Module<br/>No dependencies]
    Layouts[Layouts Module<br/>Depends on: Base]
    Auth[Auth Module]
    Email[Email Module]
    Payments[Payments Module<br/>Depends on: Auth, Base]
    Website[Website Module<br/>Depends on: Base, Layouts, Auth]
    Notes[Notes Module<br/>Depends on: Auth, Base, Payments]
    
    Layouts --> Base
    Payments --> Auth
    Payments --> Base
    Website --> Base
    Website --> Auth
    Website --> Layouts
    Notes --> Auth
    Notes --> Base
    Notes --> Payments
    
    style Base fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
    style Layouts fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style Auth fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    style Email fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style Payments fill:#fce4ec,stroke:#e91e63,stroke-width:2px
    style Website fill:#e0f2f1,stroke:#009688,stroke-width:2px
    style Notes fill:#fff3e1,stroke:#f57c00,stroke-width:2px
```

**Detailed Dependencies:**

- **Base Module** → no dependencies
  - Reason: Foundation layer providing shared utilities and components

- **Layouts Module** → depends on **Base Module**
  - Reason: Uses shared UI components and utilities from Base

- **Auth Module** → no dependencies
  - Reason: Foundational authentication module independent of other modules

- **Email Module** → no dependencies
  - Reason: Standalone email sending utilities and templates

- **Payments Module** → depends on **Auth Module**, **Base Module**
  - Reason: Payment processing requires authenticated users and shared utilities

- **Website Module** → depends on **Base Module**, **Layouts Module**, **Auth Module**
  - Reason: Marketing pages use shared components, layout structures, and authentication

- **Notes Module** → depends on **Auth Module**, **Base Module**, **Payments Module**
  - Reason: Notes belong to authenticated users, use shared utilities, and integrate with payment features

**Rules:**

- Base and Auth modules are foundation layers (no dependencies)
- Email module is standalone for transactional emails
- Modules communicate via defined contracts/APIs only
- Bidirectional data relationships allowed (e.g., User ↔ Payment via foreign keys)
- Circular code dependencies forbidden (Module A imports Module B, Module B imports Module A)

---

## Cross-Module Product Rules

- **Free Trial**: For each plan they can use the product for free for 7 days, after which they need to subscribe to a paid plan (enforced by Payments + Auth modules)
- **No trash retention or archive**: All deleted notes are permanently deleted immediately
- **Auto-save interval**: All editable content auto-saves every 3 seconds (Notes module)

## Non-Goals

- Enterprise-grade user permissions and roles
- Team workspaces and shared notebooks
- Advanced formatting (charts, diagrams)
- AI-generated content suggestions
- Integration with third-party productivity tools

**Rationale:**

We optimize for simple, fast individual note-taking. Enterprise features add complexity and slow down core workflows. Users needing collaboration should use dedicated team tools.

## Assumptions & Dependencies

- Users understand basic text editing and optionally markdown (typing, selecting, deleting)

### External Dependencies

- S3 for image uploads & assets storage (Notes module)
- Resend for sending emails
- Polar for payment processing
- Google & GitHub OAuth for social login options

## Glossary

**Product-level terminology:**

- **User**: A registered account holder who can create and manage notes
- **Note/Page**: A single text document created by user. Can be called as page entity in through out the application.
- **editor**: Notion like markdown editor used to create and edit notes

_Module-specific terms are defined in respective module READMEs._

---

## Information Architecture

> _Directory structure showing where AI agents find behavioral knowledge. Each path contains specific types of product information._

```
<root>/
└─ docs/                             # complete behavioral knowledge base
   ├─ README.md                      # product vision, scope, constraints
   ├─ journeys/                      # end-to-end behavioral outcomes
   │  ├─ <journey>.md                # narrative + acceptance truth
   │  └─ <journey>.mermaid           # visual behavior flow
   └─ modules/                       # domain-isolated knowledge units
      └─ <module>/                   # single bounded context
         ├─ README.md                # responsibilities + boundaries
         ├─ CONTRIBUTING.md          # documentation rules for this module
         ├─ user-stories/            # atomic behavioral goals
         │  ├─ <story>.md            # intent + acceptance criteria
         │  └─ <story>.mermaid       # story interaction flow
         ├─ database-design.md       # domain entities + relationships
         ├─ frontend/                # user experience definition only
         │  └─ pages/                # URL-level behavioral surfaces
         │     └─ <page>/            # single user interaction boundary
         │        ├─ README.md       # goals, content, user actions
         │        └─ ui.md           # layout wireframe (ASCII)
         ├─ background/              # non-UI system capabilities
         │  └─ api/                  # behavioral API contracts
         │     └─ <route>/           # endpoint semantic boundary
         │        ├─ README.md       # params, responses, rules, errors
         │        └─ tests.md        # behavioral verification cases
         └─ backend/                 # domain logic description only
```

**Authority Hierarchy:**

When documentation conflicts, higher authority wins:

```
docs/README.md > journeys/*.md > modules/*/README.md > user-stories/*.md > pages/*/README.md > database-design.md
```

---

## Change Guardrails

**When modifying this product:**

✅ **DO:**

- Add new features as opt-in enhancements
- Preserve existing user workflows unchanged
- Make advanced features discoverable but not intrusive
- Maintain backward compatibility with user data
- Keep module boundaries clear (don't leak responsibilities)
- Allow bidirectional data relationships between modules (e.g., User ↔ Payment via foreign keys)
- Use well-defined contracts/APIs for inter-module communication

❌ **DON'T:**

- Remove features users depend on
- Change default behaviors without user consent
- Require users to relearn core workflows
- Break existing data formats or API contracts
- Create circular code dependencies (Module A imports Module B, Module B imports Module A)
- Directly couple module implementations (modules should communicate via contracts)

**Example Scenarios:**

**Good change:** Add rich text formatting as optional toggle in Notes module — plain text remains default  
**Bad change:** Force all notes to use rich text editor

**Good change:** Add new Archive feature to Notes module alongside existing Trash  
**Bad change:** Replace Trash with Archive (breaks user mental model)

**Good change:** Add social login to Auth module as additional option  
**Bad change:** Remove email/password login (breaks existing users)

**Good change:** Payment module stores `user_id` reference, Auth module stores `payment_provider_id` (bidirectional data)  
**Bad change:** Payment module directly imports and calls Auth module code (circular code dependency)

## Architectural Philosophy (Conceptual)

- **Editor Component for markdown based editing**: Use a Notion-like markdown editor component to provide rich text editing capabilities
- **Simple by design**: Minimalist UI with focus on core note-taking features, no unnecessary complexity
- **Online-only with manual save**: App requires internet connection. Manual save button always available alongside auto-save for user control.
- **Auto Sidebar**: Adding new notes automatically adds them to the sidebar for easy access, no manual organization needed. User can change order of notes in sidebar but cannot create nested notes or folders.
- **Nuxt Content + Dynamic Markdown Content**: Use strictly markdown to store notes (no HTML) in database and use Nuxt Content & MDC syntax for rendering markdown content in frontend. This allows us to have a consistent markdown-based content format and leverage Nuxt Content's powerful markdown rendering capabilities.

## AI Agent Development Workflow

> _Step-by-step process for AI agents working on this product. Covers understanding, planning, implementation, validation, and maintenance across the entire development lifecycle._

### Phase 1: Understanding Product Context

**When starting any task:**

1. Read **this README** for:
   - Product vision and value proposition
   - Module overview and responsibilities
   - Cross-module product rules
   - Change guardrails and architectural philosophy

2. Review **module dependency graph** to understand:
   - Which modules your task affects
   - Integration points between modules
   - Data flow and relationships

3. Read **relevant module READMEs** for:
   - Domain model (entities and relationships)
   - Module-specific rules
   - UX philosophy
   - Boundaries and responsibilities

4. Review **journeys** that involve your task:
   - End-to-end user flows
   - Acceptance criteria
   - Cross-module interactions

**Determinism Check:**  
_Can you explain what your task affects without reading code?_  
If no → documentation incomplete, ask human for clarification.

---

### Phase 2: Planning Changes

**Before writing any code:**

1. **Identify affected modules:**
   - Which module owns this feature?
   - Which modules does it integrate with?

2. **Check constraints:**
   - Review cross-module product rules
   - Check module boundaries (scope creep?)
   - Verify architectural philosophy alignment

3. **Validate dependencies:**
   - Will this create new module dependencies?
   - Are circular code dependencies introduced?
   - Are bidirectional data relationships needed?

4. **Draft implementation plan:**
   - Write acceptance criteria
   - List test scenarios
   - Identify edge cases
   - Note documentation updates needed

5. **Human review checkpoint:**
   - Present plan to human
   - Get approval before implementation

---

### Phase 3: Implementation

**During development:**

1. **Test-Driven Development (TDD):**
   - Write tests first (delegate to Test Writer Agent)
   - Run tests → expect failure
   - Implement code
   - Run tests → pass

2. **Respect module boundaries:**
   - Implement within assigned module only
   - Use contracts/APIs for inter-module communication
   - Don't leak responsibilities to other modules

3. **Follow UX philosophy:**
   - Adhere to module's interaction patterns
   - Maintain consistency with existing flows
   - Don't break user mental models

4. **Apply architectural philosophy:**
   - Fast by default
   - Data durability
   - Graceful degradation

5. **Database changes (if needed):**
   - Delegate to DB Designer Agent
   - Update `database-design.md`
   - Maintain referential integrity

---

### Phase 4: Validation

**Before marking task complete:**

1. **All tests pass:**
   - Unit tests
   - Integration tests
   - Edge case coverage

2. **Cross-module rules respected:**
   - No violations of product-wide constraints
   - Module boundaries maintained

3. **Dependencies validated:**
   - Module dependency graph unchanged (or explicitly updated in README)
   - No circular code dependencies introduced

4. **User journeys still achievable:**
   - Affected journeys still work end-to-end
   - Acceptance criteria met

5. **Change guardrails followed:**
   - Existing user workflows preserved
   - Backward compatibility maintained
   - No breaking changes

---

### Phase 5: Documentation Maintenance

**After implementation complete:**

1. **Update module README if:**
   - New entities added to domain model
   - New module rules introduced
   - Module responsibilities changed
   - UX philosophy evolved

2. **Update this product README if:**
   - New module added
   - Module dependencies changed
   - Cross-module rules added/modified
   - Product boundaries changed

3. **Update journeys if:**
   - User flow changed
   - New steps added to existing journey
   - Acceptance criteria modified

4. **Update glossary if:**
   - New product-wide terminology introduced
   - Existing terms redefined

5. **Update user stories if:**
   - Acceptance criteria changed
   - New stories added
   - Stories deprecated

**Documentation First Principle:**  
_If behavior changed, documentation MUST change before code is merged._

---

### Common Workflows

**Adding a new feature:**

```
Phase 1 → Phase 2 → Human Review → Phase 3 → Phase 4 → Phase 5
```

**Fixing a bug:**

```
Phase 1 (understand affected modules) → Phase 3 (TDD fix) → Phase 4 (validate) → Phase 5 (if behavior changed)
```

**Refactoring:**

```
Phase 1 → Phase 4 (ensure no behavioral changes) → Phase 5 (update only if module boundaries changed)
```

---

### Escalation Points

**When to ask human for help:**

- Documentation conflicts detected (multiple sources of truth)
- Proposed change violates change guardrails
- Cross-module rules unclear or contradictory
- Module boundaries ambiguous
- Breaking change unavoidable
- New module needed (requires product-level decision)

---

## Notes for Future AI Agents

- **This document defines WHAT at product level, never HOW**
- **All product-wide behavioral truth flows from here**
- **Module-specific details live in module READMEs**
- **If contradictions found, this README wins**
- **Implementation may change; product definition must not**
