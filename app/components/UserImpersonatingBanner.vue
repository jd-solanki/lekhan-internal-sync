<script lang="ts" setup>
const userStore = useUserStore()
</script>

<template>
  <UBanner
    :title="`You are currently impersonating user &quot;${userStore.user?.name || userStore.user?.email}&quot;`"
    :ui="{ center: 'gap-4' }"
    class="z-[60]"
    :actions="[
      {
        label: 'Stop Impersonation',
        variant: 'outline',
        onClick: userStore.stopImpersonating,
      },
    ]"
  />
</template>
