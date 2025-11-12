<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  redirectIfSignedIn: true,
  isAuthRequired: false,
})

const lastSignInMethod = authClient.getLastUsedLoginMethod()
</script>

<template>
  <div>
    <AuthMethodsMagicLink v-if="lastSignInMethod === 'magic-link'" />
    <AuthMethodsPassword v-else />

    <!-- This is demo only, Please remove it from your project -->
    <DemoSignInMethodSelector class="absolute left-1/2 -translate-x-1/2 bottom-6" />
  </div>
</template>
