<script lang="ts" setup>
const userStore = useUserStore()
</script>

<template>
  <LayoutDefaultUserDropdown class="max-lg:hidden">
    <!-- Trigger -->
    <UButton
      class="flex items-center gap-x-3"
      block
      variant="ghost"
    >
      <UAvatar
        :alt="userStore.user?.name"
        :text="getInitials(userStore.user?.name)"
        :src="userStore.avatarUrl"
      />
      <p class="text-ellipsis overflow-hidden text-start">
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
