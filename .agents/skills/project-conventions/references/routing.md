# Routing Conventions

## Retrieving Query Parameters

Use dedicated utilities when accessing router query values:

```typescript
// ✅ Good - Single value
const page = getFirstQueryValue(route.query.page)

// ✅ Good - Multiple values with types
const parsedQuery = useParsedQuery(
  z.object({
    redirectUrl: redirectUrlSchema.optional(),
    nextAction: z.string().optional(),
    productId: z.coerce.number().optional(),
  }),
  {}, // default values
  { route }, // optionally pass route if exist via `const route = useRoute()`
)

// ❌ Avoid - Direct access
const page = route.query.page // Could be string | string[] | undefined
const section = route.query.section as string
```

## Why These Utilities

- **`getFirstQueryValue()`** - Safely extracts a single query parameter (handles string | string[] ambiguity)
- **`useParsedQuery()`** - Type-safe parsing of multiple query parameters with zod schema validation

**Rationale**: Query parameters can be arrays (`?id=1&id=2`) or strings. Direct access is error-prone. These utilities normalize handling.
