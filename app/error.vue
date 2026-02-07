<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const userStore = useUserStore()

const errorRedirectRoute = computed(() => {
  // If error occurs on docs page (E.g. 404), redirect back to docs
  if (route.path.startsWith('/docs'))
    return '/docs'

  return userStore.userHomeRoute
})
</script>

<template>
  <NuxtLayout
    name="blank"
    class="grid place-items-center"
  >
    <UError
      :error="error"
      :redirect="errorRedirectRoute"
    />
  </NuxtLayout>
</template>
