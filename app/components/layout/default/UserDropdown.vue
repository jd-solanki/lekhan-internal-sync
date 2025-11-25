<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const userStore = useUserStore()
const route = useRoute()

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
    // Render Dashboard link if not already in /app route
    ...(
      !route.path.startsWith('/app')
        ? [
            [
              {
                label: 'Dashboard',
                icon: 'i-lucide-home',
                to: '/app',
              },
            ],
          ]
        : []
    ),
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
  <UDropdownMenu :items="userDropdownItems">
    <!-- Dropdown Item: Profile -->
    <template #profile>
      <div class="flex items-center gap-2">
        <UAvatar
          :src="userStore.avatarUrl"
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

    <!-- Trigger -->
    <slot />
  </UDropdownMenu>
</template>
