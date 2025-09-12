<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <NuxtLayout
    name="blank"
    class="grid place-items-center"
  >
    <div class="max-w-prose text-center space-y-12">
      <div>
        <h1 class="text-primary">
          {{ error?.statusCode }}
        </h1>
        <p>{{ error?.message }}</p>
      </div>

      <DevOnly>
        <div class="overflow-auto text-start bg-(--ui-bg-muted) p-4 rounded-lg">
          <pre>{{ error }}</pre>
        </div>
      </DevOnly>

      <UButton
        :to="runtimeConfig.public.app.routes.home"
        class="ms-auto"
      >
        Go back home
      </UButton>
    </div>
  </NuxtLayout>
</template>
