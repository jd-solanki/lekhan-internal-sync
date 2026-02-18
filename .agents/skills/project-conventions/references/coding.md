# Coding Conventions

## Reactive State Management

Never create custom reactive values for managing state. Use `useWithLoading` utility instead:

```typescript
// ❌ Avoid - Custom reactive state
const isLoading = ref(false)
const error = ref<string | null>(null)
const data = ref<User | null>(null)

const fetchUser = async (id: string) => {
  isLoading.value = true
  try {
    data.value = await $fetch(`/api/users/${id}`)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// ✅ Good - Use useWithLoading
const { isPending, execute } = useWithLoading(async (id: string) => {
  return await $fetch(`/api/users/${id}`)
})

const data = ref<User | null>(null)
const error = ref<string | null>(null)

const fetchUser = async (id: string) => {
  try {
    data.value = await execute(id)
  } catch (err) {
    error.value = err.message
  }
}
```

## Why useWithLoading

- **Single source of truth**: Loading state managed in one place
- **Consistent patterns**: All async operations behave the same
- **Error handling**: Built-in support for pending/completed states
- **Less boilerplate**: Reduces repetitive try/catch/finally patterns

**Rationale**: Custom loading flags lead to state synchronization bugs and inconsistent behavior. A dedicated utility ensures reliability.
