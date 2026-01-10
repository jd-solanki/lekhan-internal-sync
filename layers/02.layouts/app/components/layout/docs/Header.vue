<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  navigation: ContentNavigationItem[] | undefined
}>()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const navMenuItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-home',
  },
  {
    label: 'Docs',
    to: '/docs',
    icon: 'i-lucide-book-open',
    active: route.path.startsWith('/docs'),
  },
  {
    label: 'Blog',
    to: '/blog',
    icon: 'i-lucide-newspaper',
    active: route.path.startsWith('/blog'),
  },
])

const navMenuItemsWOIcons = computed<NavigationMenuItem[]>(() => navMenuItems.value.map(item => ({
  ...item,
  icon: undefined,
})))
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

    <UNavigationMenu :items="navMenuItemsWOIcons" />

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

      <UButton
        to="/#pricing"
        class="text-nowrap"
      >
        Get {{ runtimeConfig.public.app.name }}
      </UButton>
    </template>

    <template #body>
      <UNavigationMenu
        :items="navMenuItems"
        orientation="vertical"
        :external-icon="false"
      />

      <!--
        Only render separator if there is sidebar to show
        E.g. Blog page has no sidebar
      -->
      <USeparator
        v-if="navigation && navigation.length"
        class="my-6"
        type="dashed"
      />
      <LayoutDocsContentNavigation
        :navigation
        variant="link"
      />
    </template>
  </UHeader>
</template>
