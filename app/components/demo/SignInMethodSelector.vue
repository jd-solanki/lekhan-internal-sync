<script setup lang="ts">
const signInMethods = [
  { label: 'Password', value: 'email' },
  { label: 'Magic Link', value: 'magic-link' },
]
const lastSignInMethod = authClient.getLastUsedLoginMethod()
</script>

<template>
  <div class="flex gap-2 items-center">
    <span class="text-muted text-nowrap">Sign in via</span>
    <USelect
      :model-value="lastSignInMethod === 'magic-link' ? 'magic-link' : 'email'"
      :items="signInMethods"
      class="w-36 text-muted"
      @update:model-value="v => lastSignInMethod = v"
    />
  </div>
</template>
