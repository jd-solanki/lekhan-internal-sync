<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const runtimeConfig = useRuntimeConfig()

const userStore = useUserStore()
const paymentsStore = usePaymentsStore()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Documentation',
    to: '/docs',
    target: '_blank',
  },
  {
    label: 'Changelog',
    to: '/docs/changelog',
    target: '_blank',
  },
  // {
  //   label: 'Blog',
  //   to: '/blog',
  // target: '_blank',
  // },
])

const { data: products } = await useFetch('/api/polar/products')
const product = computed(() => products.value?.result.items[0])

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'No products found',
  })
}

// INFO: As we're already checking product is purchased we can directly call `createCheckoutSession`
const hasPurchasedProduct = await paymentsStore.hasPurchasedProduct(product.value.id)
</script>

<template>
  <UHeader
    :title="runtimeConfig.public.app.name"
    to="/"
    :ui="{ right: 'gap-3' }"
  >
    <UNavigationMenu :items="items" />
    <template #right>
      <LayoutDefaultUserDropdown v-if="userStore.user">
        <!-- Trigger -->
        <UAvatar
          :src="userStore.avatarUrl"
          :alt="userStore.user?.name"
          :text="getInitials(userStore.user?.name)"
        />
      </LayoutDefaultUserDropdown>
      <UButton
        v-if="!hasPurchasedProduct"
        loading-auto
        @click="paymentsStore.createCheckoutSession(product!.id)"
      >
        Get LaunchDayOne
      </UButton>
    </template>
  </UHeader>
</template>
