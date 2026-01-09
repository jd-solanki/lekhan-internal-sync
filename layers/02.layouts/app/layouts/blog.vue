<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div>
    <LayoutDocsHeader :navigation="[]" />

    <UMain :class="[route.meta.mainClass]">
      <slot />

      <!--
        Moved footer inside main as a workaround for NuxtUI layout issue
        Issue Link: https://github.com/nuxt/ui/issues/4955#issuecomment-3728543855
      -->
      <LayoutDocsFooter />
    </UMain>
  </div>
</template>
