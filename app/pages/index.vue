<script lang="ts" setup>
const userStore = useUserStore()
</script>

<template>
  <div>
    <h1>Index Page</h1>
    <pre>{{ userStore.user }}</pre>
    <pre>{{ $route.meta }}</pre>
    <UButton @click="userStore.signOut">
      Sign Out
    </UButton>
    <UButton to="/play">
      Go to Play
    </UButton>
  </div>
</template>
