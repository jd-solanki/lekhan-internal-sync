<script lang="ts" setup>
import type { FooterColumn } from '@nuxt/ui'

const route = useRoute()
const appConfig = useAppConfig()

const columns: FooterColumn[] = [
  {
    label: 'Resources',
    children: [
      {
        label: 'Documentation',
        to: '/docs/',
        target: '_blank',
      },
      {
        label: 'Changelog',
        to: '/docs/changelog',
        target: '_blank',
      },
      {
        label: 'Discord',
        to: appConfig.socials.discord,
        target: '_blank',
      },
      {
        label: 'GitHub',
        to: appConfig.github.url,
        target: '_blank',
      },
    ],
  },
  {
    label: 'Legal',
    children: [
      {
        label: 'Terms of Service',
        to: '/terms',
        target: '_blank',
      },
      {
        label: 'Privacy Policy',
        to: '/privacy',
        target: '_blank',
      },
    ],
  },
]
</script>

<template>
  <div>
    <WebsiteHeader />

    <UMain :class="[route.meta.mainClass]">
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>
      <template #right>
        <UFooterColumns :columns="columns" />
      </template>
    </UFooter>
  </div>
</template>
