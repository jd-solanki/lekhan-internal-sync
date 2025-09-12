<script lang="ts" setup>
const route = useRoute()
const routeMeta = route.meta
</script>

<template>
  <main
    class="grow"
    :class="[routeMeta.mainClass]"
  >
    <slot />
  </main>
</template>
