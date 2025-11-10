<script lang="ts" setup>
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  userDropdownItems: DropdownMenuItem[][]
}>()

const userStore = useUserStore()
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
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
          ...appConfig.layout.default.adminNavigationItems,
        ]
      : []
    : appConfig.layout.default.navigationItems,
  appConfig.layout.default.navigationFooterItems,
])
</script>

<template>
  <UDashboardSidebar
    :default-size="256"
    toggle-side="right"
    :ui="{
      body: 'px-2 sm:px-2 pt-0',
      header: 'h-14 px-4 sm:px-4',
      root: 'border-none min-h-[calc(100svh-var(--app-banner-height,0px))]',
      content: 'max-w-[256px] divide-none bg-(--ui-bg-muted) dark:bg-black',
      footer: 'px-4 sm:px-4',
    }"
  >
    <template #header>
      <ULink
        :to="runtimeConfig.public.app.routes.home"
        class="flex gap-3 items-center text-highlighted"
      >
        <NuxtImg
          :src="appConfig.app.logoUrl"
          alt="LaunchDayOne Logo"
          class="size-6 dark:invert"
          :class="appConfig.app.logoClass"
        />
        <h1 class="font-bold">
          {{ appConfig.app.title }}
        </h1>
      </ULink>
    </template>
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

    <template #footer>
      <LayoutDefaultUserDropdown
        :user-dropdown-items
        class="max-lg:hidden"
      >
        <!-- Trigger -->
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
          <p class="text-ellipsis overflow-hidden">
            {{ userStore.user?.name || userStore.user?.email }}
          </p>
          <div class="grow" />
          <UIcon
            name="i-lucide-chevron-up"
            class="shrink-0"
          />
        </UButton>
      </LayoutDefaultUserDropdown>
    </template>
  </UDashboardSidebar>
</template>
