<script lang="ts" setup>
import type { FooterColumn } from '@nuxt/ui'

// const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const columns: FooterColumn[] = [
  {
    label: runtimeConfig.public.app.name,
    children: [
      {
        label: 'Features',
        to: '/#features',
        active: false,
      },
      {
        label: 'Pricing',
        to: '/#pricing',
        active: false,
      },
      {
        label: 'Testimonials',
        to: '/#testimonials',
        active: false,
      },
      {
        label: 'FAQ',
        to: '/#faq',
        active: false,
      },
    ],
  },
  {
    label: 'Resources',
    children: [
      {
        label: 'Documentation',
        href: 'javascript:void(0)',
      },
      {
        label: 'Changelog',
        href: 'javascript:void(0)',
      },
      {
        label: 'Discord',
        href: 'javascript:void(0)',
      },
      {
        label: 'Knowledge Base',
        href: 'javascript:void(0)',
      },
    ],
  },
  {
    label: 'Legal',
    children: [
      {
        label: 'Terms of Service',
        to: '/legal/terms',
        target: '_blank',
      },
      {
        label: 'Privacy Policy',
        to: '/legal/privacy',
        target: '_blank',
      },
    ],
  },
]
</script>

<template>
  <UFooter
    class="lg:py-10 bg-muted"
    :ui="{ container: 'md:items-start! flex! max-md:flex-col md:justify-between', right: 'order-3! md:justify-end max-md:justify-start', left: 'max-md:justify-start max-md:mb-10' }"
  >
    <template #left>
      <div>
        <div class="flex items-center gap-3 text-highlighted mb-2">
          <AppLogo class="size-6" />
          <span class="text-xl font-semibold">
            {{ runtimeConfig.public.app.name }}
          </span>
        </div>
        <p class="text-muted text-sm max-w-80 text-balance">
          A minimal, distraction-free note-taking app for writers who want to focus on their words.
        </p>
        <UBadge
          variant="outline"
          class="inline-flex rounded-full px-3 gap-1 items-center mt-6"
          color="neutral"
        >
          <span>Built with</span>
          <UColorModeImage
            class="size-3"
            light="/nuxtstart-logo.png"
            dark="/nuxtstart-logo-dark.png"
            :alt="`${runtimeConfig.public.app.name} Logo`"
          />
          <span class="font-semibold">NuxtStart</span>
        </UBadge>
        <p class="text-muted text-sm mt-6">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </div>
    </template>
    <template #right>
      <UFooterColumns
        :ui="{ center: 'min-[510px]:grid' }"
        :columns="columns"
      />
    </template>
  </UFooter>
</template>
