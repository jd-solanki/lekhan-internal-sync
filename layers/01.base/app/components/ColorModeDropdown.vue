<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const colorMode = useColorMode()

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: 'System',
    icon: 'i-lucide-monitor',
    onSelect: () => colorMode.preference = 'system',
  },
  {
    label: 'Light',
    icon: 'i-lucide-sun',
    onSelect: () => colorMode.preference = 'light',
  },
  {
    label: 'Dark',
    icon: 'i-lucide-moon',
    onSelect: () => colorMode.preference = 'dark',
  },
])

const activeItem = computed(() => {
  const currentPreference = colorMode.preference
  return items.value.find(item => item.label?.toLowerCase() === currentPreference)
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ item: 'items-center gap-x-2' }"
  >
    <UButton
      :icon="activeItem?.icon"
      color="neutral"
      variant="ghost"
    />
    <template #item-trailing="{ item }">
      <UIcon
        v-show="item.label === activeItem?.label"
        name="i-lucide-check"
        :size="20"
      />
    </template>
  </UDropdownMenu>
</template>
