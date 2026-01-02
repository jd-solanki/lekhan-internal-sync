<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  redirectIfSignedIn: true,
  isAuthRequired: false,
  // Render betterAuth errors via toast
  flashMessageErrorQueryAlias: 'error',
})
</script>

<template>
  <div>
    <AuthMethodsPassword />
  </div>
</template>
