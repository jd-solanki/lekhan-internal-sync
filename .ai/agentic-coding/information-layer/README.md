# Canonical AI-First Information Layer

## Purpose

Define a **pure information architecture** that enables any AI coding workflow (AFK, HITL, hybrid, or future orchestration models) to reliably understand product behavior, constraints, and system intent **without coupling to implementation mechanics**.

This layer is:

* **Implementation-agnostic**
* **Deterministic**
* **Traceable**
* **Minimal but complete**
* **Stable across tooling evolution**

The information layer must remain usable even if:

* agents change
* execution loops change
* tech stack changes
* coding methodology changes

---

## Separation of Concerns

### Information Layer (this document)

Contains only:

* product intent
* behavioral truth
* structural boundaries
* domain knowledge
* user experience definition
* data semantics
* API contracts

**Never includes:**

* PRDs
* execution logs
* sprint mechanics
* task orchestration
* testing workflows
* commit/branch strategy
* automation loops

Those belong to the **Implementation Layer** (out of scope).

---

## Core Principles

### 1. Behavior Over Code

All knowledge expressed as:

* journeys
* stories
* user outcomes
* domain rules
* contracts

Never as:

* components
* services
* functions
* frameworks

---

### 2. Deterministic Readability for AI

Documentation must be:

* structured
* unambiguous
* minimal redundancy
* source-traceable
* machine-navigable

So any AI agent can:

* reconstruct intent
* infer required implementation
* verify behavioral coverage

without human clarification.

---

### 3. Single Source of Truth Hierarchy

Strict authority order:

```
Journeys → Stories → Module Docs → Page/API Specs → Data Design
```

Lower levels **must not contradict** higher levels.

---

### 4. Implementation Independence

Information must **not assume**:

* Nuxt
* Postgres
* Vitest
* Ralph loop
* PRD format
* branch workflow

Technology may change.
Behavioral truth must not.

---

## Canonical Directory Structure (Information Only)

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
         ├─ backend/              # non-UI system capabilities
         │  └─ api/                  # behavioral API contracts
         │     └─ <route>/           # endpoint semantic boundary
         │        ├─ README.md       # params, responses, rules, errors
         │        └─ tests.md        # behavioral verification cases
         └─ backend/                 # domain logic description only
```

### Structural Guarantees

* Entire product understandable **without reading code**.
* URLs derived from `frontend/pages`.
* System capabilities derived from `backend/api`.
* Data meaning derived from `database-design.md`.
* No execution artifacts allowed.

---

## Information Components

### Project README

Must define:

* product vision
* primary users
* global constraints
* non-goals
* architectural philosophy (conceptual, not technical)

---

### Journeys — Highest Behavioral Authority

Describe:

* real user outcome
* start → end flow
* participating modules
* success definition

Rules:

* technology-free
* UI-agnostic
* implementation-agnostic
* human-readable narrative
* machine-traceable acceptance bullets

---

### Stories — Atomic Behavioral Units

Each story:

* belongs to **one journey**
* defines **one user goal**
* includes **deterministic acceptance criteria**
* excludes **technical design**

Stories form the **minimum behavioral surface** an implementation must satisfy.

---

### Module README — Domain Boundary

Defines:

* responsibility of module
* what it owns
* what it must never own
* relationships to other modules
* domain terminology

Prevents architectural drift across implementations.

---

### Database Design — Semantic Data Model

Contains:

* entities and meaning
* relationships
* invariants
* lifecycle rules
* privacy/security semantics

Must avoid:

* migrations
* ORM syntax
* indexing strategy tied to vendor

Focus: **what data means**, not **how stored**.

---

### Pages — User Experience Contract

Each page README defines:

* user intent
* visible information
* actions available
* state transitions
* empty/loading/error states
* SEO meaning of route

`ui.md` provides:

* structural layout
* hierarchy of elements
* interaction zones

No framework or component naming allowed.

---

### APIs — System Capability Contract

Each endpoint README defines:

* purpose
* inputs
* outputs
* business rules
* error semantics
* authorization logic
* edge cases

`tests.md` defines:

* behavioral scenarios
* expected outcomes
* boundary conditions

Independent of:

* transport protocol
* framework
* language

---

### Backend Domain Description

Explains:

* core domain rules
* calculations
* invariants
* workflows
* side effects

Never:

* class names
* services
* file paths
* framework constructs

---

## Determinism Requirements

Documentation must allow an AI to:

1. Infer complete feature scope.
2. Detect missing behavior.
3. Reconstruct valid implementation plan.
4. Validate behavioral coverage post-implementation.

If any of the above fails → information layer incomplete.

---

## Evolution Rules

Changes must:

* originate from **behavior change**, not code change
* update **journeys first**, then cascade downward
* never introduce implementation leakage
* preserve backward traceability

---

## Non-Goals of Information Layer

Explicitly excluded:

* sprint planning
* task breakdown
* testing execution
* CI/CD
* environments
* branching
* automation agents
* coding standards tied to tools

These belong to the **Implementation Layer**.

---

## Success Criteria

Information layer is complete when:

* a new AI agent can implement the product **without human clarification**
* behavior can be audited **without reading code**
* implementation can change **without rewriting documentation**
* multiple execution models can coexist using same knowledge base

This defines the **stable foundation** for all future AI-driven development.
