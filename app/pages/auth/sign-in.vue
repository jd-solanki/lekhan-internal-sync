<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  redirectIfSignedIn: true,
  isAuthRequired: false,
  // Render betterAuth errors via toast
  flashMessageErrorQueryAlias: 'error',
})

const lastSignInMethod = authClient.getLastUsedLoginMethod() || 'email'
const selectedSignInMethod = ref(lastSignInMethod)
</script>

<template>
  <div>
    <AuthMethodsMagicLink v-if="selectedSignInMethod === 'magic-link'" />
    <AuthMethodsPassword v-else />

    <!-- This is demo only, Please remove it from your project -->
    <DemoSignInMethodSelector
      v-model="selectedSignInMethod"
      class="absolute left-1/2 -translate-x-1/2 bottom-6"
    />
  </div>
</template>
