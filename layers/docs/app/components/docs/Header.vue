<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'
import type { ButtonProps } from '@nuxt/ui'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

defineProps<{
  navigation: ContentNavigationItem[] | undefined
}>()

const runtimeConfig = useRuntimeConfig()

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')

// INFO: You can use computed to dynamically generate links based on props or other state.
//  E.g. DIsplaying GitHub link if provided in appConfig.
const links: ButtonProps[] = [
  // Your links here
]
</script>

<template>
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/docs/getting-started"
  >
    <UNavigationMenu />

    <template #right>
      <ClientOnly>
        <UContentSearchButton :collapsed="!largerThanLg" />
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
      <DocsContentNavigation
        :navigation
        variant="link"
      />
    </template>
  </UHeader>
</template>
