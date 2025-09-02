<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const userStore = useUserStore()
const appConfig = useAppConfig()
const { isAdminOnlyRoute } = useAdmin()
const colorMode = useColorMode()

const userDropdownItems = ref<DropdownMenuItem[][]>([
  [
    {
      slot: 'profile',
      label: userStore.user?.name,
      avatar: {
        src: userStore.user?.image ?? undefined,
        alt: userStore.user?.name,
      },
      type: 'label',
    },
  ],
  [
    {
      label: 'Theme',
      icon: 'i-lucide-moon',
      children: appConfig.layout.default.themePreferences,
    },
  ],
  ...(userStore.isUserAdmin
    ? [
        [
          {
            label: 'Admin',
            icon: 'i-lucide-shield',
            to: '/admin/users',
          },
        ],
      ]
    : []
  ),
  [
    {
      label: 'Sign Out',
      icon: 'i-lucide-log-out',
      color: 'error',
      onClick: userStore.signOut,
    },
  ],
])

const items: ComputedRef<NavigationMenuItem[][]> = computed(() => [
  isAdminOnlyRoute.value
    ? userStore.isUserAdmin
      ? [
          {
            label: 'Back to App',
            to: '/app',
            icon: 'i-lucide-arrow-left',
          },
          ...appConfig.layout.default.adminNavigationItems,
        ]
      : []
    : appConfig.layout.default.navigationItems,
  appConfig.layout.default.navigationFooterItems,
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
      class="grow px-2 [&_ul]:last-of-type:mt-auto [&_div]:last-of-type:hidden"
      :style="colorMode.value === 'light' ? { '--ui-bg-elevated': 'color-mix(in oklch, var(--ui-color-neutral-200), white 40%)' } : {}"
      tooltip
    />
    <footer class="py-4 px-5 space-y-4">
      <CommandPalette />
      <UDropdownMenu
        :items="userDropdownItems"
        :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
      >
        <template #profile>
          <div class="flex items-center gap-2">
            <UAvatar
              :src="userStore.user?.image ?? undefined"
              :alt="userStore.user?.name"
              :text="getInitials(userStore.user?.name)"
            />
            <div>
              <p> {{ userStore.user?.name }} </p>
              <p class="text-xs text-muted font-normal">
                {{ userStore.user?.email }}
              </p>
            </div>
          </div>
        </template>
        <UButton
          class="flex items-center gap-x-3"
          block
          variant="ghost"
        >
          <UAvatar
            :alt="userStore.user?.name"
            :text="getInitials(userStore.user?.name)"
            :src="userStore.user?.image ?? undefined"
          />
          <p>{{ userStore.user?.name }}</p>
          <div class="grow" />
          <UIcon name="i-lucide-chevron-up" />
        </UButton>
      </UDropdownMenu>
    </footer>
  </aside>
</template>
