<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center min-h-dvh',
  redirectIfLoggedIn: true,
  isAuthRequired: false,
})

const lastSignInMethod = useCookie('lastSignInMethod')
</script>

<template>
  <div>
    <AuthMethodsMagicLink v-if="lastSignInMethod === 'magic_link'" />
    <AuthMethodsPassword v-else />

    <!-- This is demo only, Please remove it from your project -->
    <DemoSignInMethodSelector class="absolute left-1/2 -translate-x-1/2 bottom-6" />
  </div>
</template>
