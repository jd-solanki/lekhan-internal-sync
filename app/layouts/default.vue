<script lang="ts" setup>
import type { CommandPaletteGroup, DropdownMenuItem } from '@nuxt/ui'

const userStore = useUserStore()
const appConfig = useAppConfig()
const commandPaletteStore = useCommandPalette()

const groups: ComputedRef<CommandPaletteGroup[]> = computed(() => [
  ...(
    commandPaletteStore._pageActions
      ? [{
          id: 'pageActions',
          label: 'Page Actions',
          items: commandPaletteStore._pageActions,
        }]
      : []
  ),
  ...(userStore.isUserAdmin
    ? [
        {
          id: 'adminPages',
          label: 'Admin Pages',
          items: appConfig.layout.default.adminNavigationItems.map(i => ({ ...i, active: false })),
        },
      ]
    : []
  ),
  {
    id: 'pages',
    label: 'Pages',
    // Don't mark current page items as active
    items: appConfig.layout.default.navigationItems.map(i => ({ ...i, active: false })),
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      {
        icon: 'lucide:log-out',
        label: 'Sign Out',
        onSelect: userStore.signOut,
      },
    ],
  },
])

// NOTE: Ensure it's computed to update the items when admin impersonate any user
const userDropdownItems = computed<DropdownMenuItem[][]>(() => {
  return [
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
