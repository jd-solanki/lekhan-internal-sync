<script lang="ts" setup>
import type { TabsItem } from '#ui/types'

const route = useRoute()

const DEFAULT_TAB = 'profile'

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
  {
    label: 'Security',
    icon: 'i-lucide-shield',
    value: 'security',
  },
]

const validTabs = tabs.map(tab => tab.value)

const activeTab = computed({
  get() {
    // Extract tab from route path: /app/account-settings/profile -> profile
    const pathSegments = route.path.split('/')
    const tab = pathSegments[pathSegments.length - 1]
    return tab === 'account-settings' ? DEFAULT_TAB : tab
  },
  set(value: string | number) {
    return navigateTo(`/app/account-settings/${value}`)
  },
})

// Redirect to default tab if on parent route or invalid tab
onMounted(async () => {
  const pathSegments = route.path.split('/')
  const currentTab = pathSegments[pathSegments.length - 1]

  if (route.name === 'app-account-settings' || !validTabs.includes(currentTab)) {
    await navigateTo(`/app/account-settings/${DEFAULT_TAB}`, { replace: true })
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
