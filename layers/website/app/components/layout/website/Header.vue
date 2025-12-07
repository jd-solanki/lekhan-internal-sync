<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/"
    :ui="{ right: 'gap-3' }"
  />
</template>
