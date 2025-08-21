<script lang="ts" setup>
const userStore = useUserStore()
</script>

<template>
  <div class="p-12">
    <h1>Play Page....</h1>
    <pre>{{ userStore.user }}</pre>
    <pre>{{ $route.meta }}</pre>
    <UButton to="/">
      Go to Home
    </UButton>
  </div>
</template>
