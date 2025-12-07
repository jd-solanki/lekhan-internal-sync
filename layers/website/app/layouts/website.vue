<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div>
    <LayoutWebsiteHeader />

    <UMain :class="[route.meta.mainClass]">
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <LayoutWebsiteFooter />
  </div>
</template>
