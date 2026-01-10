<script lang="ts" setup>
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <NuxtImg
    v-if="typeof appConfig.app.logo === 'string'"
    :src="appConfig.app.logo"
    :alt="`${runtimeConfig.public.app.name} Logo`"
  />
  <UColorModeImage
    v-else
    :light="appConfig.app.logo.light"
    :dark="appConfig.app.logo.dark"
    :alt="`${runtimeConfig.public.app.name} Logo`"
  />
</template>
