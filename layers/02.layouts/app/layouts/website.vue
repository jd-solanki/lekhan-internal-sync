<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-svh">
    <LayoutWebsiteHeader />

    <!--
      Added `min-h-auto` to remove calculated min-height
      Related: https://github.com/nuxt/ui/issues/4955
    -->
    <UMain
      :class="[route.meta.mainClass]"
      class="min-h-auto grow"
    >
      <slot />
    </UMain>

    <LayoutWebsiteFooter />
  </div>
</template>
