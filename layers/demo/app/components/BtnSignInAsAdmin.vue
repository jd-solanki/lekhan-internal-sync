<script setup lang="ts">
const userStore = useUserStore()

function signInAsAdmin() {
  userStore.signIn({
    email: 'admin@mail.com',
    password: 'adminadmin',
  })
}
</script>

<template>
  <UButton
    color="neutral"
    block
    variant="outline"
    class="mt-6 py-2"
    trailing-icon="i-lucide-log-in"
    @click="signInAsAdmin"
  >
    Sign in as Admin user (Demo Only)
  </UButton>
</template>
