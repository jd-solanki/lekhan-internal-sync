# Base Module

Owns shared foundational capabilities used by all modules, while remaining domain-agnostic.

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Providing reusable, cross-module building blocks (utilities, composables, middleware patterns, shared config, base components)
- Defining common guardrails and primitives other modules can compose safely
- Standardizing shared interaction patterns (state/query handling, validation boundaries, user feedback primitives)
- Serving as stable foundation layer that all modules may depend on

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

Base module owns **no business entities**. It owns shared primitives and contracts only.

### Relationships

**Within Module:**

- Shared primitives compose with each other to provide consistent defaults and safe extension points.

**Cross-Module References:**

- **Base** → **All Modules**: Foundation dependency
  - **Meaning**: Other modules consume shared primitives from base
  - **Contract**: Base exports generic capabilities that remain domain-neutral and backward-conscious

## Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- **Domain neutrality**: Any capability in base must remain reusable across multiple modules without domain assumptions.
- **Composition over ownership**: Base provides primitives and patterns; consuming modules own business workflows.
- **Stable contracts**: Shared APIs in base should evolve conservatively to avoid broad downstream breakage.
- **No reverse dependency**: Base must not depend on feature modules.
- **Single source for shared patterns**: Cross-module patterns belong in base; module-specific variants belong in that module.
- **Security-safe defaults**: Shared primitives must favor safe defaults so consumers do not need to reimplement baseline safeguards.

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- None at module level. Base is foundation.

**Depended on by:**

- 02.layouts Module
- Auth Module
- Blog Module
- Docs Module
- Email Module
- Payments Module
- Website Module

**Integration Contract:**

- Consuming modules may use base capabilities as shared infrastructure.
- Base contracts must stay generic; consumers adapt them to domain context.
- If a capability is only needed by one module and not generally reusable, it should live outside base.

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

**Core Interaction Principles:**

- Shared UX primitives should be predictable, minimal, and composable.
- Defaults should reduce repeated boilerplate across modules.
- Shared feedback/validation patterns should encourage consistency across product surfaces.
- UX primitives in base should avoid product-specific language, flows, or assumptions.

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section._

Base module provides **no user-facing pages**. It provides reusable building blocks consumed by pages in other modules.

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients. Detailed specs live in `backend/api/` subdirectories._

**Capability Categories (high-level):**

- Shared composable primitives for common client concerns
- Shared utility primitives for cross-module reuse
- Shared middleware patterns for route/runtime guardrails
- Shared base components for repeated UI structure and interactions
- Shared schema/type primitives for common validation and typing boundaries
- Shared server-side helpers for recurring backend concerns
- Minimal operational endpoints required for platform baseline concerns

**Contract Scope:**

- This section defines categories and intent, not exhaustive implementation inventory.
- Detailed implementation can evolve without requiring README rewrites, as long as boundary and contract remain true.

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Foundation Capability**: A reusable building block intentionally designed for multiple modules.
- **Shared Primitive**: Low-level utility/composable/component that provides one clear concern and composes with others.
- **Contract Stability**: Expectation that base interfaces evolve carefully due to broad usage.
- **Domain Neutrality**: Property of a base capability that avoids assumptions about auth, payments, content, or other feature domains.
- **Boundary Guardrail**: Rule that prevents base from absorbing feature-specific behavior.

_Product-wide terms (User, API, Module, Layer) defined in product README._

## Notes for Future AI Agents

- This README defines **module-level WHAT**, not code inventory.
- Do not treat current files/functions as full module definition; implementation may grow or change.
- Before adding anything to base, ask: "is this reusable across multiple modules and domain-neutral?"
- If answer is no, keep it in the owning feature module.
- If a change introduces dependence on a feature module, boundary violation — escalate.
- Prefer minimal, composable primitives over opinionated feature abstractions in base.
- Product-level authority: `docs/README.md` overrides this file on conflict.
