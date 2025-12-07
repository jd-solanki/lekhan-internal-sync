<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'

withDefaults(defineProps<{
  variant?: 'pill' | 'link'
  navigation: ContentNavigationItem[] | undefined
}>(), {
  variant: 'pill',
})
</script>

<template>
  <UContentNavigation
    highlight
    :variant="variant"
    :navigation="navigation"
  />
</template>
