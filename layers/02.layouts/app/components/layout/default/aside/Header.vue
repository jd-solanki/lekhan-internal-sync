<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()
</script>

<template>
  <ULink
    :to="userStore.userHomeRoute"
    class="flex gap-3 items-center text-highlighted"
  >
    <AppLogo class="size-6" />
    <h1 class="font-bold">
      {{ runtimeConfig.public.app.name }}
    </h1>
  </ULink>
</template>
