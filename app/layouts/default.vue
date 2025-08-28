<script lang="ts" setup>
const route = useRoute()
const routeMeta = route.meta
</script>

<template>
  <div class="flex min-h-dvh bg-black">
    <LayoutDefaultAside />
    <main
      :class="[routeMeta.mainClass]"
      class="grow bg-(--ui-bg) rounded-lg m-2 ring ring-(--ui-border) p-6 overflow-auto"
    >
      <slot />
    </main>
  </div>
</template>
