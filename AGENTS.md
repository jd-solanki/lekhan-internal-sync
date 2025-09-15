# AGENTS GUIDE

> Canonical operating manual for AI coding/design/documentation agents working in this repository. Concise, action‑oriented, source‑of‑truth distilled from `.prompts/*.instructions.md`.

## 1. Mission & Scope

- Build and maintain a production‑grade, modular, scalable Nuxt 4 SaaS boilerplate (LaunchDayOne).
- Uphold security, performance, maintainability, extensibility, and developer experience.
- Always minimize code while maximizing clarity, reuse, and type safety.
- Default to best practices; challenge anti‑patterns politely with rationale.

## 2. Core Behavioral Rules

1. Always read/re‑read relevant `.prompts` instruction files before non‑trivial work.
2. Collect full context (schemas, existing composables, APIs) BEFORE proposing changes.
3. Start problem solving with uncertainty: write 2–3 short reasoning paragraphs clarifying hypotheses when debugging or designing.
4. Prefer existing utilities/composables/libraries over reinventing logic (e.g. `useFetch`, `VueUse`, Drizzle query APIs, shared Zod schemas).
5. Keep answers technology‑agnostic ONLY when generating generic system flowcharts (see Flowcharts section); otherwise, ground in Nuxt stack.
6. If user asks for something sub‑optimal, explain risks and offer a better alternative.
7. Produce incremental, verifiable, minimal diffs. Avoid unrelated refactors.
8. Add tests first for new features or bug reproductions (happy path + 1–2 edge cases).
9. Keep code self‑documenting; add comments only for non‑obvious intent, invariants, and complex flows.
10. Never duplicate validation or schema definitions—reuse from `shared/schemas`.

## 3. Project Architecture Principles

- Domain + feature modularity; clear separation of client (`app/`) and server (`server/`).
- Shared cross‑runtime assets live in `shared/` (schemas, types, utils, constants, formatters, validation).
- Auto‑imports: leverage Nuxt auto‑imports; only explicit import when needed in `<script>` for dynamic use.
- Encapsulate per‑page components inside `app/components/pages/<page>/` when truly page‑specific.
- Keep server handlers thin: validation → business logic → persistence → response.
- Favor composables for reusable logic (`app/composables/`).

## 4. Coding Standards (Vue / Nuxt / TS)

- Use `<script setup lang="ts">` exclusively.
- Strong typing everywhere (function params, returns, store state, composable outputs).
- Use `ref`, `computed`, and functions within setup stores (Pinia). Export stores as `use<Name>Store`.
- Single‑responsibility functions; short pure functions where possible.
- Prefer computed derivations to watchers; use `watch` only for side effects.
- Avoid deep prop drilling—extract composables or context patterns.

## 5. Validation & Schemas

- Use Zod v4; ergonomic error messages via ternary style error resolvers.
- Search `shared/schemas/` before creating new schema.
- Database table schemas mirrored in `shared/schemas/db/*` for client/server reuse.

## 6. Server & API Conventions

- Files under `server/api/**` use `defineEventHandler`.
- Always validate: `getValidatedQuery`, `getValidatedRouterParams`, `readValidatedBody`.
- RESTful resource naming: plural collections (`/tasks` not `/task`, no verb prefixes like `/get-tasks`).
- Depth limit: max `collection/resource/collection`.
- CRUD pattern: `GET /x`, `POST /x`, `GET /x/{id}`, `PUT /x/{id}`, `PATCH /x/{id}`, `DELETE /x/{id}`.
- Deletion idempotency: deleting an already deleted resource returns 204.
- Response shape: wrap lists in an object with a named array + `meta` (e.g. `{ tasks: [...], meta: { total } }`).
- Business logic returns generic / client‑agnostic payloads.
- Use transactions when multiple dependent writes must succeed together.

## 7. Database (Drizzle ORM)

- Add new tables under `server/db/schemas/...` and corresponding Zod schemas under `shared/schemas/db/`.
- Reuse mixins (timestamps, etc.) from `server/db/schemas/mixins.ts`.
- Prefer high‑level query APIs (`db.query.table.findMany`) before crafting raw SQL.
- Only abstract CRUD helpers if duplication emerges.

## 8. Authentication & Authorization

- Central auth flows: email/password, magic link, optional socials (exclusive choice between password vs magic link at a time, socials can coexist).
- Tokens: `magic_link`, `reset_password`, `forgot_password`, `email_verification`, etc.
- Admin can ban / impersonate; users can deactivate self.
- Account linking is explicit (no silent auto‑link on matching email).
- Use Pinia user store (`useUserStore`) for session state, not direct session util calls on client.

## 9. Nuxt UI (v3+) Usage

- Always wrap app with `<UApp>` (see `app.vue`).
- Use v3 component names only (e.g. `USeparator`, `UDropdownMenu`, `UFormField`, `USwitch`).
- Replacements for removed aggregates: rely on `UApp` instead of legacy `UModals`, `USlideovers`, `UNotifications`.
- Use semantic colors (`primary`, `neutral`, `error`, etc.) and design tokens (`text-muted`, `bg-elevated`, `border-default`). Avoid raw Tailwind colors unless necessary.
- Use `items` prop (not `links`/`options`).
- Overlay pattern: trigger (default slot) + `#content` or structured `#body`/`#footer` slots.
- Loading: `loading-auto` on async buttons.
- `useOverlay` replaces `useModal`/`useSlideover`.
- Event handler objects: use `onClick`, not `click`.
- Theming configured in `app.config.ts` via Tailwind Variants format.

## 10. Styling & Theming

- Prefer Tailwind 4 utility classes + semantic design tokens; avoid custom `<style>` blocks unless unavoidable.
- Use semantic tokens for dark/light coherence instead of manual `dark:` variants.

## 11. Error Handling & UX Feedback

- Server: throw `createError` with safe generic messages for sensitive operations.
- Client: capture errors and surface via toast (`useToastMessage` / Nuxt UI toast composable) with fallback message.
- Avoid leaking internal details (IDs, stack traces) in responses.

## 12. Testing Strategy

- Use Vitest + `@nuxt/test-utils` for unit / component / integration tests.
- Add tests before implementing new feature logic; include at least: success path, validation failure, and one edge case.
- Mock external network / provider calls.

## 13. Performance & Scalability

- Leverage SSR‐safe data fetching (`useFetch`, `useAsyncData`).
- Code‑split via route boundaries and lazy dynamic imports when heavy.
- Avoid overfetching: separate endpoints for distinct concerns rather than bloated aggregates.
- Use semantic design tokens + minimal DOM for render performance.

## 14. Security Guidelines

- Sanitize & validate all inputs (client + server).
- Escape user‑generated HTML to prevent XSS.
- Use HttpOnly cookies for auth; never expose secrets client‑side.
- Return generic error responses for auth-sensitive actions.

## 15. Flowcharts & System Diagrams

When asked to produce flowcharts:

- Provide granular, multi‑diagram (one per major sub‑flow) Mermaid syntax.
- Include: user actions (frontend), API endpoints, validation, branching logic, DB interactions, statuses, security checks, hashing, token issuance, email sending, success + error codes/messages.
- Omit technology names unless explicitly requested; focus on logical flow.
- Escape characters that might break Mermaid; avoid problematic parentheses / quotes as per instructions.
- Exclude rate limiting / throttling explicitly unless requested.

## 16. Documentation Responsibilities

- Maintain `AGENTS.md` (this file) when `.prompts` rules materially change.
- Keep high‑level project docs concise (see `README.md` + `.prompts/docs.instructions.md`).
- When new domain capability added, append a succinct note to relevant `.prompts/*.instructions.md`.

## 17. Environment & Config

- Centralize environment variable validation in shared env utility.
- Distinguish public vs private runtime config.
- Support staging/production differences without branching logic explosion.

## 18. Emails & Templates

- Use existing template components under `emails/` (button, divider, spacer, etc.).
- Keep logic light; heavy conditional rendering belongs in server utilities.

## 19. Decision Logging

For non‑trivial architectural shifts:

- Record: context, options considered, decision, rationale, follow‑ups.
- Place note in a short comment block near affected code or update `.prompts/common.instructions.md`.

## 20. Quality Gate Checklist (Before Merge)

- Types: No TS errors (`tsc --noEmit`).
- Lint: ESLint passes; no new warnings for touched lines.
- Tests: All existing + new tests green.
- Security: Inputs validated; secrets untouched.
- Performance: No obvious regressions (unnecessary loops, n+1 DB queries).
- Docs: Updated if behavior or contracts changed.

## 21. Request Handling Pattern (Template)

1. Gather context (schemas, related files, existing endpoints/components).
2. Clarify uncertainties (list hypotheses) — short reasoning paragraphs.
3. Propose minimal plan; confirm if ambiguous.
4. Write or update tests (failing first for new behavior).
5. Implement code with smallest diffs.
6. Run tests + lint + type check.
7. Provide summary + next steps / optional optimizations.

## 22. Anti‑Patterns to Avoid

- Duplicated validation logic.
- Over‑abstracting before repetition occurs.
- Mixing persistence logic inside UI components.
- Returning unstructured arrays instead of objects with meta.
- Embedding provider‑specific response shapes directly in UI.
- Large god components or stores; split by responsibility.
- Silent failure swallowing (always propagate or surface meaningful error).

## 23. When Unsure

- State uncertainty explicitly.
- Enumerate 2–3 plausible interpretations.
- Choose the least risky reversible path.
- Invite clarification without blocking if safe to proceed under assumptions.

## 24. Assumptions (Safe Defaults)

- Postgres is primary target; future engines must respect shared schema abstractions.
- Tailwind tokens + Nuxt UI remain the design baseline.
- Zod schemas are authoritative for validation & typing.

## 25. Quick Reference (TL;DR)

- Reuse > Rewrite.
- Validate everything.
- Keep payloads generic.
- Semantic tokens + v3 Nuxt UI patterns only.
- Tests before features.
- Minimal diffs, explicit reasoning, update docs.
