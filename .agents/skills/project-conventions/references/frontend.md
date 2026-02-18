# Frontend Conventions

## Type Reuse from Backend

Avoid re-creating backend types in the frontend. Use `InternalAPI` from `nitropack` to import server types directly:

```typescript
// ❌ Avoid - Duplicating types
// types/user.ts (frontend)
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

// ✅ Good - Import from backend
// composables/useUser.ts
import type { InternalApi } from 'nitropack'

type User = InternalApi['/api/users/me']['get']['user']

const { data: user } = await useAsyncData('user', () => 
  $fetch('/api/users/me', { 
    parseResponse: (response) => response as typeof InternalAPI.UserResponse
  })
)
```

## Where This Applies

- **API response types**: The shape of data returned from backend endpoints
- **Database entity types**: Types that mirror your Drizzle schemas
- **Validation schemas**: Use Zod schemas from backend (see [Zod Conventions](zod.md))
- **Request/response DTOs**: Data transfer objects defined on the server

## What Still Lives on Frontend

- **Component state types**: UI-specific state (selections, filters, visibility)
- **View models**: Types that organize data for display (different from backend DTOs)
- **UI-only types**: Form state, modal visibility, pagination info

**Rationale**: Single source of truth prevents type mismatches, keeps frontend in sync with backend changes, and reduces maintenance burden.

## Reactive State Management

Never create custom reactive values for managing state. Use `useWithLoading` utility instead:

```typescript
// ❌ Avoid - Custom reactive state
const state = reactive<Partial<FormData>>({
  email: undefined,
  name: undefined,
  password: undefined,
})

const isLoading = ref(false)
const error = ref<string | null>(null)

async function onSubmit(event: FormSubmitEvent<FormData>) {
  isLoading.value = true
  try {
    const { data, error: err } = await authClient.admin.createUser(event.data)
    if (err) {
      error.value = err.message
    }
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    isLoading.value = false
  }
}

// ✅ Good - Use useWithLoading
const state = reactive<Partial<FormData>>({
  email: undefined,
  name: undefined,
  password: undefined,
})

async function _onSubmit(event: FormSubmitEvent<FormData>) {
  const { data, error } = await authClient.admin.createUser(event.data)
  if (error) {
    throw new Error(error.message)
  }
  emit('close', !!data)
}

const { isLoading, fnWithLoading: onSubmit } = useWithLoading(_onSubmit)
```

## Why useWithLoading

- **Single source of truth**: Loading state managed in one place
- **Consistent patterns**: All async operations behave the same
- **Error handling**: Built-in support for pending/completed states
- **Less boilerplate**: Reduces repetitive try/catch/finally patterns

**Rationale**: Custom loading flags lead to state synchronization bugs and inconsistent behavior. A dedicated utility ensures reliability.

## Exception: UButton `loading-auto`

`UButton` has a `loading-auto` prop that automatically shows a loading spinner while an async `@click` handler is pending. Do **not** create manual loading state for this case.

```vue
<!-- ✅ No loading state needed -->
<UButton loading-auto @click="onSubmit">Submit</UButton>
```
