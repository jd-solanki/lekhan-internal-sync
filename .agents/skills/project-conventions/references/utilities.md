# Utilities Conventions

## Loading State Utilities

Use project loading wrappers instead of hand-rolled loading flags.

### `createWithLoading`

Type-safe wrapper for async operations with loading state.

```typescript
const isSubmitting = ref(false)
const withLoading = createWithLoading(isSubmitting)

await withLoading(async () => {
	await authClient.sendVerificationEmail({ email })
})
```

Location: `/app/utils/withLoading.ts`

### `createWithLoadingFor`

Preserves function signatures while adding loading state.

```typescript
const isLoading = ref(false)
const fetchUserWithLoading = createWithLoadingFor(isLoading, authClient.getUser)

const user = await fetchUserWithLoading('123', options)
```

### `useWithLoading`

Composable wrapper around loading patterns.

```typescript
const { isLoading, fnWithLoading: sendVerificationEmail } = useWithLoading(_sendVerificationEmail)
await sendVerificationEmail('ada@example.com')
```

Location: `/app/composables/useWithLoading.ts`

### Selection Guidance

- Use `createWithLoading` when wrapping inline async blocks.
- Use `createWithLoadingFor` when wrapping an existing function while preserving args/return type.
- Use `useWithLoading` in Vue components/composables where both wrapped fn and loading ref are needed.

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
