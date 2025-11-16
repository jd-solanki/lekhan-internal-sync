<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  userDropdownItems: DropdownMenuItem[][]
}>()

const userStore = useUserStore()
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
