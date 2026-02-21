<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/"
  >
    <template #right>
      <ColorModeDropdown />
    </template>
  </UHeader>
</template>
