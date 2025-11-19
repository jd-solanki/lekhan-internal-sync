<script lang="ts" setup>

</script>

<template>
  <div>
    <WebsiteHeader />

    <UMain>
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
