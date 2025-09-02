<script lang="ts" setup>
const route = useRoute()
const routeMeta = route.meta
</script>

<template>
  <div class="flex min-h-dvh bg-(--ui-bg-muted) dark:bg-black">
    <LayoutDefaultAside class="sticky max-h-dvh top-0 left-0 shrink-0" />
    <main
      :class="[routeMeta.mainClass]"
      class="grow bg-(--ui-bg) rounded-lg m-2 ring ring-(--ui-border) p-6 overflow-auto"
    >
      <slot />
    </main>
  </div>
</template>
