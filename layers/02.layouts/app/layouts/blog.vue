<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div>
    <LayoutDocsHeader :navigation="[]" />

    <UMain :class="[route.meta.mainClass]">
      <slot />
    </UMain>

    <LayoutDocsFooter />
  </div>
</template>
