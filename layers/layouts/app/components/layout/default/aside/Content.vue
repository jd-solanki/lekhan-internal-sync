<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
import { adminNavigationItems, navigationFooterItems, navigationItems } from '~/constants/asideNavigation'

const userStore = useUserStore()
const { isAdminOnlyRoute } = useAdmin()
const colorMode = useColorMode()

const items: ComputedRef<NavigationMenuItem[][]> = computed(() => [
  isAdminOnlyRoute.value
    ? userStore.isUserAdmin
      ? [
          {
            label: 'Back to App',
            to: '/app',
            icon: 'i-lucide-arrow-left',
          },
          ...adminNavigationItems,
        ]
      : []
    : navigationItems,
  navigationFooterItems,
])
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items[0]"
    tooltip
    :style="colorMode.value === 'light' ? { '--ui-bg-elevated': 'color-mix(in oklch, var(--ui-color-neutral-200), white 40%)' } : {}"
    :ui="{ label: 'py-2.5', link: 'py-2.5' }"
  />
  <UNavigationMenu
    orientation="vertical"
    :items="items[1]"
    tooltip
    :style="colorMode.value === 'light' ? { '--ui-bg-elevated': 'color-mix(in oklch, var(--ui-color-neutral-200), white 40%)' } : {}"
    class="mt-auto"
    :ui="{ label: 'py-2.5', link: 'py-2.5' }"
  />
  <UDashboardSearchButton class="mx-2 max-lg:hidden" />
</template>
