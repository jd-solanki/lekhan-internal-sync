<script lang="ts" setup>
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()
</script>

<template>
  <ULink
    :to="userStore.userHomeRoute"
    class="flex gap-3 items-center text-highlighted"
  >
    <NuxtImg
      :src="appConfig.app.logoUrl"
      :alt="`${runtimeConfig.public.app.name} Logo`"
      class="size-6 dark:invert"
      :class="appConfig.app.logoClass"
    />
    <h1 class="font-bold">
      {{ runtimeConfig.public.app.name }}
    </h1>
  </ULink>
</template>
