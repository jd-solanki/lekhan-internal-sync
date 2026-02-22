# Pinia Conventions

## Data Fetching in Actions

Use `$fetch` in pinia store actions/methods for data fetching:

```typescript
// ✅ Good
const userStore = defineStore('user', () => {
  const fetchUserData = async (id: string) => {
    return await $fetch(`/api/users/${id}`)
  }
  
  return { fetchUserData }
})
```

## Type Inference from API Contracts

Infer store payload/params/response types from `InternalApi` (or shared API contract schema types) instead of redefining backend-derived types manually.

```typescript
import type { InternalApi } from 'nitropack/types'

// ✅ Good - inferred from backend contract
type Products = InternalApi['/api/polar/products']['get']['products']
const products = ref<Products>([])

// ❌ Avoid - manual backend-derived type redefinition
interface Product {
  id: number
  name: string
}
const products = ref<Product[]>([])
```

Rationale: contract inference removes drift between server routes and store typing.

### GET response inference

```typescript
import type { InternalApi } from 'nitropack/types'

// Full response shape of GET /api/notes/:id
type Note = InternalApi['/api/notes/:id']['get']
const note = ref<Note | null>(null)
```

### Extracting request body type

`InternalApi` only maps response types; for request bodies use the shared Zod schema:

```typescript
import type { PublicSchemaUpdateNote } from '~~/layers/notes/shared/schemas/db'
// PublicSchemaUpdateNote is z.infer<typeof publicSchemaUpdateNote>

async function updateNote(id: string, body: PublicSchemaUpdateNote) {
  return $fetch(`/api/notes/${id}`, { method: 'PATCH', body })
}
```

## Component Data Fetching on Mount

Use `useAsyncData` instead of calling store methods in `onMounted`:

```typescript
// ✅ Good
const { data: user } = await useAsyncData('user', () => 
  userStore.fetchUserData(userId)
)

// ❌ Avoid
onMounted(async () => {
  user.value = await userStore.fetchUserData(userId)
})
```

**Rationale**: `useAsyncData` handles SSR data serialization, prevents hydration mismatches, and provides automatic caching. It integrates with Nuxt's data fetching pipeline properly.
