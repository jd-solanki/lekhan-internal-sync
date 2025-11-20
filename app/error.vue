<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const userStore = useUserStore()
</script>

<template>
  <NuxtLayout
    name="blank"
    class="grid place-items-center"
  >
    <UError
      :error="error"
      :redirect="userStore.userHomeRoute"
    />
  </NuxtLayout>
</template>
