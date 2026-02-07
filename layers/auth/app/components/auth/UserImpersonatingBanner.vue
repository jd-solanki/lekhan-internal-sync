<script lang="ts" setup>
defineProps<{
  name: string
  stopImpersonationHandler: () => Promise<void>
}>()
</script>

<template>
  <UBanner
    :title="`You are currently impersonating user &quot;${name}&quot;`"
    :ui="{ center: 'gap-4' }"
    class="z-60"
    :actions="[
      {
        label: 'Stop Impersonation',
        variant: 'outline',
        onClick: stopImpersonationHandler,
      },
    ]"
  />
</template>
