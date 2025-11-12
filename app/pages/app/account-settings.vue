<script lang="ts" setup>
import type { TabsItem } from '#ui/types'

const route = useRoute()

const tabs: TabsItem[] = [
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    value: 'profile',
  },
  {
    label: 'Linked Accounts',
    icon: 'i-lucide-link',
    value: 'linked-accounts',
  },
]

const activeTab = computed({
  get() {
    // Extract tab from route path: /app/account-settings/profile -> profile
    const pathSegments = route.path.split('/')
    const tab = pathSegments[pathSegments.length - 1]
    return tab === 'account-settings' ? 'profile' : tab
  },
  set(value: string | number) {
    return navigateTo(`/app/account-settings/${value}`)
  },
})

// Redirect to profile if on parent route
onMounted(async () => {
  if (route.name === 'app-account-settings') {
    await navigateTo('/app/account-settings/profile', { replace: true })
  }
})
</script>

<template>
  <div>
    <AppPageHeader title="Account Settings" />

    <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 mt-8">
      <!-- Left Sidebar with Tabs -->
      <div>
        <UTabs
          v-model="activeTab"
          :items="tabs"
          orientation="vertical"
          :unmount-on-hide="false"
          :content="false"
          variant="link"
          class="w-full"
        />
      </div>

      <!-- Right Content Area -->
      <div class="min-h-[400px]">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
