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
