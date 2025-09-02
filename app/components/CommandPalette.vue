<script lang="ts" setup>
import type { CommandPaletteGroup } from '@nuxt/ui'

const userStore = useUserStore()
const appConfig = useAppConfig()

const isCommandPaletteOpen = ref(false)
const toggleCommandPalette = () => isCommandPaletteOpen.value = !isCommandPaletteOpen.value

defineShortcuts({
  meta_k: toggleCommandPalette,
})

const groups: CommandPaletteGroup[] = [
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
  {
    id: 'theme',
    label: 'Theme',
    items: appConfig.layout.default.themePreferences,
  },
]
</script>

<template>
  <UModal v-model:open="isCommandPaletteOpen">
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-search"
      class="w-full flex"
    >
      <span>Search...</span>
      <div class="grow" />
      <div>
        <UKbd value="meta" />
        <UKbd value="K" />
      </div>
    </UButton>

    <template #content>
      <UCommandPalette
        :groups="groups"
        class="h-80"
        @update:model-value="toggleCommandPalette"
      />
    </template>
  </UModal>
</template>
