<script lang="ts" setup>
showFlashMessageFromCookie()
const userStore = useUserStore()
await userStore.init()
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
