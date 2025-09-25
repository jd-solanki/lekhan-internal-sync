<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <NuxtLayout
    name="blank"
    class="grid place-items-center"
  >
    <UError
      :error="error"
      :redirect="runtimeConfig.public.app.routes.home"
    />
  </NuxtLayout>
</template>
