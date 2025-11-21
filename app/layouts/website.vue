<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div>
    <WebsiteHeader />

    <UMain :class="[route.meta.mainClass]">
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </div>
</template>
