# AI-First AFK Design System

## Mission

Provide a lossless, deterministic, behavior-first system enabling a **single developer** to autonomously design, implement, test, and deliver full-stack web application features using AI agents with minimal manual intervention while preserving the complete guarantees of the original AFK Ralph specification.

The system must remain:

* Vendor-agnostic across AI coding tools
* Deterministic at repository and execution levels
* Fully traceable from journey → story → PRD → code → tests → PR
* Backward-compatible with all original AFK safety rules

---

## Core AFK Principles (Preserved From Original Spec)

* **AFK-first** — agents execute autonomously; humans intervene only on review or hard blockers.
* **Lean context** — agents rely strictly on repository documentation and files, never chat memory.
* **Module-level isolation** — each sprint operates inside a single module boundary.
* **Ralph loop discipline** — small steps, tests first, commit often.
* **Strict TDD enforcement** — no task completes unless tests pass.
* **Draft PR on sprint completion**.

These principles are **non‑negotiable** and must never be weakened.

---

## Technology & Quality Baseline

Stack:

* TypeScript
* Nuxt (full‑stack)
* Postgres
* Vitest

Testing & quality (fixed):

* Vitest + `@nuxt/test-utils`
* Nitro APIs verified via `$fetch`
* ESLint only (no Prettier)
* Coverage delta reporting in `progress.txt`

## Directory Structure

```plaintext
.agents/                             # AFK agent system root
└─ docs/                             # canonical documentation for agents
   ├─ README.md                      # global product + architecture truth
   ├─ journeys/                      # behavioral journeys (top authority)
   │  ├─ <journey>.md                # journey narrative + acceptance
   │  └─ <journey>.mermaid           # journey flow diagram
   └─ modules/                       # isolated module workspaces
      └─ <module>/                   # single sprint boundary
         ├─ README.md                # module purpose + responsibilities
         ├─ CONTRIBUTING.md          # rules agents must re-read each run
         ├─ user-stories/            # deterministic behavioral stories
         │  ├─ <story>.md            # story definition + acceptance
         │  └─ <story>.mermaid       # story flow visualization
         ├─ database-design.md       # schema, relations, indexes
         ├─ prd.json                 # sprint task list
         ├─ progress.txt             # append-only execution log
         ├─ frontend/                # Nuxt UI surface for module
         │  └─ pages/                # filesystem routes (SEO-critical)
         │     └─ <page>/            # individual route boundary
         │        ├─ README.md       # page goal, content, behavior
         │        └─ ui.md           # ASCII wireframe + layout map
         └─ backend/                 # server/background capabilities
            └─ api/                  # Nitro filesystem endpoints
               └─ <route>/           # path+method (e.g. users/[id].get)
                  ├─ README.md       # params, response, errors, security
                  └─ tests.md        # AI-generated test scenarios
```

## Documentation System

### Project Documentation

```
.agents/docs/README.md
```

Contains only:

* Product goals
* Architecture overview
* Stack
* Global constraints

No agent‑execution instructions allowed.

---

## Behavioral Architecture

### Journeys (Top Behavioral Truth)

```
.agents/docs/journeys/<journey>.md
.agents/docs/journeys/<journey>.mermaid
```

Defines:

* End‑to‑end business outcome
* Participating modules
* High‑level acceptance behavior

Journeys are the **primary behavioral authority**.

---

### Stories (Journey Decomposition)

```
.agents/docs/modules/<module>/user-stories/<story>.md
.agents/docs/modules/<module>/user-stories/<story>.mermaid
```

Rules:

* Every story maps to **exactly one journey**.
* One behavioral goal per story.
* No UI/DB/API implementation detail allowed.
* Deterministic, testable acceptance criteria required.
* Agents must never invent stories.

---

## Module Documentation Structure

```plaintext
.agents/docs/modules/<module>/
├─ README.md
├─ CONTRIBUTING.md
├─ user-stories/
├─ database-design.md
├─ prd.json
├─ progress.txt
├─ frontend/
└─ backend/
```

Sprint rules (from original spec):

* `prd.json` and `progress.txt` exist **only on sprint branch**.
* Each sprint starts with **fresh regenerated files**.

## Deterministic PRD Generation

### Inputs (original + behavioral)

* Journey docs
* Story docs
* Module README
* `database-design.md`
* Generated flows

### Output

Single **sprint‑scoped PRD**.

### Exact Task Schema (unchanged from original)

```json
{
  "category": "ui | functional | database | api | testing | documentation | other | <extensible>",
  "description": "clear description of the task",
  "steps": ["single atomic step"],
  "tests": ["verification command"],
  "passes": false
}
```

Hard guarantees preserved:

* Exactly **one atomic step per task**.
* Deterministic ordering required.
* **Source references to originating docs mandatory**.
* `passes` becomes true **only after all tests succeed**.

PRD may be **human‑mutable during observation phase** without removing these guarantees.

## Ralph AFK Execution Loop (Original Discipline Restored)

### Startup

1. Human creates sprint branch.
2. Agent reads all project + module documentation.
3. PRD generated deterministically.
4. PRD validated for:

   * atomic steps
   * deterministic order
   * valid source references
5. Human performs one‑time verification.
6. Ralph loop begins.

### Task Selection

Instead of first unfinished task:

```
regardless of order select highest‑priority critical task where passes == false
```

Priority derived from:

* Journey criticality
* Dependency ordering
* Human PRD edits

### Ralph Loop Steps

For selected task:

1. Write failing tests first.
2. Implement minimal code to pass.
3. Refactor after green.
4. Run all commands listed in `tests`.
5. Execute regression suite.
6. If successful:

   * mark `passes: true`
   * commit atomically to branch
   * append structured log to `progress.txt`

## Progress Logging

Each entry must include:

* Task completed and PRD item reference
* Key decisions made and reasoning
* Files changed
* Outcome
* Any blockers or notes for next iteration

Ensures full auditability. Keep entries concise. Sacrifice grammar for the sake of concision. This file helps future iterations skip exploration.

## Failure Modes & Recovery (Restored)

Agents must:

* Never mark pass if any test fails.
* Never implement multiple PRD tasks together.
* On failure:
  * revert to last commit
  * retry once
  * then declare BLOCKED
* On scope ambiguity → stop and BLOCK.

During early observation, human may intervene before BLOCK finalization.

## Completion & Block Signals (Machine‑Readable)

### On success

```shell
<promise>COMPLETE</promise>
```

### On unrecoverable blocker

```shell
<promise>BLOCKED</promise>
```

These signals are required for automation compatibility.

## Draft Pull Request Rule

When all PRD tasks pass:

* Agent opens **draft PR** from sprint branch.
* Human performs final review and merge.
* Agents **never merge code**.

## Deterministic Safety Scope

Currently guaranteed:

* Behavior traceability from journey → commit
* Test‑verified task completion
* Full Ralph audit trail
* Original AFK safety semantics preserved

Deferred to later maturity:

* Mandatory E2E per journey
* Full environment determinism (maybe using Docker Sandbox)
* Multi‑developer orchestration
