<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  isAuthRequired: false,
})
</script>

<template>
  <UContainer class="space-x-4">
    <UPageHeader
      title="Landing Page"
      description="🏗️ WIP"
    />
    <div class="mt-12 flex flex-wrap gap-4">
      <UButton to="/auth/sign-in">
        Sign In
      </UButton>
      <UButton to="/app">
        App
      </UButton>
      <UButton to="/docs">
        Docs
      </UButton>
    </div>
  </UContainer>
</template>
