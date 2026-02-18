# Utilities Conventions

## Placement

Generic utilities that can be reused across the application go in `utils/` directory, not embedded in components or module-specific files:

```
utils/
├── formatting.ts       # Format dates, currencies, strings
├── validation.ts       # Common validation logic
├── parsing.ts          # Parse query params, URLs, etc.
├── request.ts          # HTTP request helpers
└── transformers.ts     # Data transformation utilities
```

## What Goes in Utils

- **Reusable functions**: Logic used in multiple places
- **Formatting helpers**: Date, currency, string formatting
- **Parsing/validation**: Query parameters, form validation
- **Data transformers**: Mapping, filtering, aggregating data
- **Request utilities**: API calls, error handling patterns

## What Stays Local

- **Component-specific logic**: UI state, animation timing
- **Feature-specific utilities**: Only used within one feature/module
- **Type transformations**: Module-level data mapping

## Why This Matters

```typescript
// ❌ Avoid - Each component recreating the same function
// pages/users.vue
const formatDate = (d: Date) => d.toLocaleDateString()

// pages/posts.vue  
const formatDate = (d: Date) => d.toLocaleDateString()

// ✅ Good - Centralized, reusable
// utils/formatting.ts
export const formatDate = (d: Date) => d.toLocaleDateString()
```

**Rationale**: Centralized utilities reduce duplication, improve maintainability, and make patterns consistent across the app.
