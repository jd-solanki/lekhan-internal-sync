<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const userStore = useUserStore()
const appConfig = useAppConfig()
const { isAdminOnlyRoute } = useAdmin()

const items: ComputedRef<NavigationMenuItem[][]> = computed(() => [
  isAdminOnlyRoute.value
    ? userStore.isUserAdmin
      ? appConfig.layout.default.adminNavigationItems
      : []
    : appConfig.layout.default.navigationItems,
])
</script>

<template>
  <aside class="w-[256px] flex flex-col">
    <header class="flex gap-3 items-center py-4 px-5">
      <NuxtImg
        :src="appConfig.app.logoUrl"
        alt="LaunchDayOne Logo"
        class="size-6 dark:invert"
        :class="appConfig.app.logoClass"
      />
      <h1 class="font-bold">
        {{ appConfig.app.title }}
      </h1>
    </header>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="grow px-2"
      tooltip
    />
    <footer class="py-4 px-5 space-y-4">
      <CommandPalette />
      <UButton
        block
        variant="soft"
        @click="userStore.signOut"
      >
        Sign Out
      </UButton>
    </footer>
  </aside>
</template>
