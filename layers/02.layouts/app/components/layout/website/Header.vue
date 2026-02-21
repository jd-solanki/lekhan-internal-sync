<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const runtimeConfig = useRuntimeConfig()

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Features', to: '/#features', active: false },
  { label: 'Pricing', to: '/#pricing', active: false },
  { label: 'Testimonials', to: '/#testimonials', active: false },
  { label: 'FAQ', to: '/#faq', active: false },
])
</script>

<template>
  <UHeader :title="runtimeConfig.public.app.name">
    <template #title>
      <AppLogo class="h-7 w-auto" />
      <span class="font-semibold ms-2">{{ runtimeConfig.public.app.name }}</span>
    </template>

    <!-- Center nav links (desktop) -->
    <UNavigationMenu :items="navItems" />

    <template #right>
      <UButton
        label="Sign in"
        color="neutral"
        variant="ghost"
        to="/auth/sign-in"
      />
      <UButton
        label="Start Free"
        to="/auth/sign-up"
      />
    </template>

    <!-- Mobile menu body -->
    <template #body>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        class="-mx-2.5"
      />
      <div class="flex flex-col gap-3 mt-4">
        <UButton
          label="Sign in"
          color="neutral"
          variant="outline"
          to="/auth/sign-in"
          block
        />
        <UButton
          label="Start Free"
          to="/auth/sign-up"
          block
        />
      </div>
    </template>
  </UHeader>
</template>
