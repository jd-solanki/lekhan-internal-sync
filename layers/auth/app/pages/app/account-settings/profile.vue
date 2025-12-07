<script lang="ts" setup>
definePageMeta({
  search: {
    label: 'Profile',
    icon: 'i-lucide-user',
  },
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-2">
      My Profile
    </h2>
    <p class="text-muted mb-8">
      Update your personal information here
    </p>

    <UCard>
      <PageAppAccountSettingsProfileUpdateAvatar class="mt-2 mb-4" />
      <PageAppAccountSettingsProfileUpdateName />
    </UCard>
  </div>
</template>
