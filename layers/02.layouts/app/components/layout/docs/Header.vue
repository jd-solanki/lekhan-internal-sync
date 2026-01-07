<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  navigation: ContentNavigationItem[] | undefined
}>()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Docs',
    to: '/docs',
    active: route.path.startsWith('/docs'),
  },
  {
    label: 'Blog',
    to: '/blog',
    active: route.path.startsWith('/blog'),
  },
  // ...Add more items as needed
])
</script>

<template>
  <!-- NOTE: Avoid using "/docs" as home to prevent auth middleware redirecting to sign in page for unauthenticated users -->
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/"
    :ui="{ right: 'gap-3' }"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-app-logo"
          class="size-6"
        />
        <h1>{{ runtimeConfig.public.app.name }}</h1>
      </div>
    </template>

    <UNavigationMenu :items />

    <template #right>
      <ClientOnly>
        <UContentSearchButton />
        <UColorModeButton />
        <template #fallback>
          <div class="size-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        </template>
      </ClientOnly>

      <USeparator
        orientation="vertical"
        class="h-4 mx-2"
      />

      <UButton to="/#pricing">
        Get {{ runtimeConfig.public.app.name }}
      </UButton>
    </template>

    <template #body>
      <LayoutDocsContentNavigation
        :navigation
        variant="link"
      />
    </template>
  </UHeader>
</template>
