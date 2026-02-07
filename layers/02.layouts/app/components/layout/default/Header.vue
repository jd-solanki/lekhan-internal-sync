<script lang="ts" setup>
const userStore = useUserStore()
</script>

<template>
  <UDashboardNavbar>
    <template #right>
      <UDashboardSearchButton
        collapsed
        class="rounded-full"
      />

      <LayoutDefaultUserDropdown>
        <!-- Trigger -->
        <UAvatar
          :src="userStore.avatarUrl"
          :alt="userStore.user?.name"
          :text="getInitials(userStore.user?.name)"
        />
      </LayoutDefaultUserDropdown>
    </template>
  </UDashboardNavbar>
</template>
