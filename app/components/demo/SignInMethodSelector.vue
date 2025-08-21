<script setup lang="ts">
const signInMethods = [
  { label: 'Password', value: 'password' },
  { label: 'Magic Link', value: 'magic_link' },
]
const lastSignInMethod = useCookie<string | undefined>('lastSignInMethod', {
  default: () => undefined,
})
</script>

<template>
  <div class="flex gap-2 items-center">
    <span class="text-muted text-nowrap">Sign in via</span>
    <USelect
      :model-value="['password', 'oauth_github', 'oauth_google'].includes(lastSignInMethod ?? '') ? 'password' : 'magic_link'"
      :items="signInMethods"
      class="w-36 text-muted"
      @update:model-value="v => lastSignInMethod = v"
    />
  </div>
</template>
