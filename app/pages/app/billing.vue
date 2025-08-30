<script lang="ts" setup>
import type { ProductPriceFixed } from '@polar-sh/sdk/models/components/productpricefixed'

const { data: products, pending } = useLazyFetch('/api/polar/products')
const paymentsStore = usePaymentsStore()
const { successToast } = useToastMessage()

// interface ProductMetaData {
//   variant: 'lite' | 'pro'
// }

// const productsByVariant = computed(() => {
//   if (!products.value)
//     return {}
//   return Object.groupBy(products.value?.result.items, p => (p.metadata as unknown as ProductMetaData).variant)
// })

const { data: activeSubscriptions, refresh: refreshActiveSubscriptions, pending: isFetchingSubscriptions } = await useLazyAsyncData(
  'polar:customer:subscriptions:list',
  async () => await authClient.customer.subscriptions.list(),
)

// NOTE: You'll have only single active subscription
const activeSubscription = computed(() => activeSubscriptions.value?.data?.result.items[0])

const isSubscriptionProcessActive = ref(false)
const withLoading = createWithLoading(isSubscriptionProcessActive)

async function handlePlanClick(productId: string) {
  if (activeSubscription.value) {
    await $fetch(`/api/polar/subscriptions/${activeSubscription.value.id}`, {
      method: 'PATCH',
      body: {
        productId,
      },
    })

    await refreshActiveSubscriptions()

    successToast({
      title: 'Subscription updated successfully!',
    })
  }
  else {
    await paymentsStore.createCheckoutSession(productId)
  }
}
</script>

<template>
  <div>
    <AppPageHeader
      title="Billing"
      description="Manage your billing information here."
    />
    <p v-if="pending">
      Loading...
    </p>
    <div
      v-else
      class="grid grid-cols-2 gap-6"
    >
      <UCard
        v-for="product in products?.result.items"
        :key="product.id"
      >
        <template #header>
          <h2>{{ product.name }}</h2>
          <UBadge
            v-if="activeSubscription?.productId === product.id"
            color="success"
          >
            Active
          </UBadge>
        </template>

        <p>{{ formatPolarAmount((product.prices[0] as unknown as ProductPriceFixed).priceAmount) }}</p>

        <UButton
          v-if="activeSubscription?.productId !== product.id"
          loading-auto
          :disabled="isSubscriptionProcessActive"
          :loading="isFetchingSubscriptions && !activeSubscriptions"
          @click="withLoading(async () => await handlePlanClick(product.id))"
        >
          {{ activeSubscription ? 'Update Plan' : 'Buy Now' }}
        </UButton>
      </UCard>
    </div>
  </div>
</template>
