<script lang="ts" setup>
const appConfig = useAppConfig()

const links = computed(() => [
  ...Object.entries(appConfig.socials || {}).map(([key, url]) => ({
    'icon': `i-simple-icons-${key}`,
    'to': url,
    'target': '_blank',
    'aria-label': `${key} social link`,
  })),
].filter(Boolean))
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <template v-if="links.length">
        <UButton
          v-for="(link, index) of links"
          :key="index"
          size="sm"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
      <UColorModeButton />
    </template>
  </UFooter>
</template>
