<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/"
  >
    <template #right>
      <ClientOnly>
        <UColorModeButton />
        <template #fallback>
          <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        </template>
      </ClientOnly>
    </template>
  </UHeader>
</template>
