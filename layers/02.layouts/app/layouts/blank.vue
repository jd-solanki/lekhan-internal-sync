<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <main
    class="grow"
    :class="[route.meta.mainClass]"
  >
    <slot />
  </main>
</template>
