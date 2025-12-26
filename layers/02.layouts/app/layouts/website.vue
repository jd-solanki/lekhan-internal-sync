<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div>
    <LayoutWebsiteHeader />

    <UMain :class="[route.meta.mainClass]">
      <slot />
    </UMain>

    <LayoutWebsiteFooter />
  </div>
</template>
