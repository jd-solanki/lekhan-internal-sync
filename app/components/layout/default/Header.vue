<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  userDropdownItems: DropdownMenuItem[][]
}>()

const userStore = useUserStore()
</script>

<template>
  <UDashboardNavbar>
    <template #right>
      <UDashboardSearchButton
        collapsed
        class="rounded-full"
      />

      <LayoutDefaultUserDropdown :user-dropdown-items>
        <!-- Trigger -->
        <UAvatar
          :src="userStore.user?.image ?? undefined"
          :alt="userStore.user?.name"
          :text="getInitials(userStore.user?.name)"
        />
      </LayoutDefaultUserDropdown>
    </template>
  </UDashboardNavbar>
</template>
