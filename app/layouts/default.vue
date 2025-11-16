<script lang="ts" setup>
import type { CommandPaletteGroup, DropdownMenuItem } from '@nuxt/ui'

const userStore = useUserStore()
const appConfig = useAppConfig()
const commandPaletteStore = useCommandPalette()
const searchableRoutes = useSearchableRoutes()

const groups: ComputedRef<CommandPaletteGroup[]> = computed(() => {
  const routeGroups: CommandPaletteGroup[] = []

  // Page Actions (if any)
  if (commandPaletteStore._pageActions && commandPaletteStore._pageActions.length > 0) {
    routeGroups.push({
      id: 'pageActions',
      label: 'Page Actions',
      items: commandPaletteStore._pageActions,
    })
  }

  // Auto-scanned routes grouped by admin/regular only
  const autoRoutes = searchableRoutes.value
  const adminRoutes = autoRoutes.filter(r => typeof r.to === 'string' && r.to.startsWith('/admin'))
  const regularRoutes = autoRoutes.filter(r => typeof r.to === 'string' && !r.to.startsWith('/admin'))

  // Admin Pages (only for admins)
  if (userStore.isUserAdmin && adminRoutes.length > 0) {
    routeGroups.push({
      id: 'adminPages',
      label: 'Admin Pages',
      items: adminRoutes,
    })
  }

  // Regular Pages
  if (regularRoutes.length > 0) {
    routeGroups.push({
      id: 'pages',
      label: 'Pages',
      items: regularRoutes,
    })
  }

  // Account actions
  routeGroups.push({
    id: 'account',
    label: 'Account',
    items: [
      {
        icon: 'i-lucide-log-out',
        label: 'Sign Out',
        onSelect: userStore.signOut,
      },
    ],
  })

  return routeGroups
})

// NOTE: Ensure it's computed to update the items when admin impersonate any user
const userDropdownItems = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        slot: 'profile',
        label: userStore.user?.name,
        avatar: {
          src: userStore.avatarUrl,
          alt: userStore.user?.name,
        },
        type: 'label',
      },
    ],
    [
      {
        label: 'Account Settings',
        icon: 'i-lucide-cog',
        to: '/app/account-settings',
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
        label: 'Theme',
        icon: 'i-lucide-moon',
        children: appConfig.layout.default.themePreferences,
      },
    ],
    [
      {
        label: 'Sign Out',
        icon: 'i-lucide-log-out',
        color: 'error',
        onClick: userStore.signOut,
      },
    ],
  ]
})
</script>

<template>
  <UDashboardGroup
    unit="px"
    class="bg-(--ui-bg-muted) top-(--app-banner-height,0) dark:bg-black"
  >
    <LayoutDefaultAside :user-dropdown-items />

    <!-- INFO: We remove 1rem from 100svh due to `m-2`. -->
    <UDashboardPanel
      :ui="{ body: 'p-0 sm:p-0 flex' }"
      class="min-h-[calc(100svh-var(--app-banner-height,0px))]"
    >
      <!-- Page Header -->
      <!-- Hide in desktop devices -->
      <template #header>
        <LayoutDefaultHeader
          :user-dropdown-items
          class="lg:hidden bg-(--ui-bg)"
        />
      </template>

      <!-- Page content -->
      <template #body>
        <main class="grow p-6 bg-(--ui-bg) lg:rounded-lg lg:m-2 ring ring-(--ui-border)">
          <slot />
        </main>
      </template>
    </UDashboardPanel>

    <!-- Command Palette -->
    <!-- Trigger button is inside Aside & Header components -->
    <UDashboardSearch :groups />
  </UDashboardGroup>
</template>
