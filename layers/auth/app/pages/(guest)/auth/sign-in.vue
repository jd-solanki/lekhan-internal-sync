<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  // Render betterAuth errors via toast
  flashMessageErrorQueryAlias: 'error',
})
</script>

<template>
  <div>
    <AuthMethodsPassword />
  </div>
</template>
