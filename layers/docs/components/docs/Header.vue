<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const links = computed(() => appConfig.github && appConfig.github.url
  ? [
      {
        'icon': 'i-simple-icons-github',
        'to': appConfig.github.url,
        'target': '_blank',
        'aria-label': 'GitHub',
      },
    ]
  : [])

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'App',
    to: '/app',
    target: '_blank',
  },
  {
    label: 'Changelog',
    to: '/docs/changelog',
    // target: '_blank',
  },
  {
    label: 'Releases',
    to: `${appConfig.github.url}/releases`,
    target: '_blank',
  },
])
</script>

<template>
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/docs/getting-started"
  >
    <UNavigationMenu :items="items" />

    <template #right>
      <UContentSearchButton :collapsed="false" />
      <ClientOnly>
        <UColorModeButton />
        <template #fallback>
          <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        </template>
      </ClientOnly>

      <template v-if="links?.length">
        <UButton
          v-for="(link, index) of links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <DocsContentNavigation variant="link" />
    </template>
  </UHeader>
</template>
