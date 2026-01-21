<script lang="ts" setup>
const paymentsStore = usePaymentsStore()
const runtimeConfig = useRuntimeConfig()

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  requiredQueryParamsOrRedirect: {
    checkout_id: {
      // Ensure we always have checkout context before attempting sync.
      redirectUrl: '/app/billing',
      errorMessage: 'Missing checkout details. Redirecting to billing.',
      redirectOptions: {
        replace: true,
      },
    },
  },
})

const checkoutId = getFirstQueryValue('checkout_id')!

// Key by checkoutId to avoid stale cache between checkouts.
const {
  data: orderResult,
  error: orderError,
  status: orderStatus,
  execute: executeOrderSync,
} = useAsyncData(
  `polar-order-sync-${checkoutId}`,
  async () => paymentsStore.syncOrderByCheckoutIdWithPolar(checkoutId),
  { immediate: false },
)

const polarSubscriptionId = computed(() => orderResult.value?.order.polarSubscriptionId ?? null)
// Only show subscription sync for recurring purchases.
const isSubscriptionSyncVisible = computed(() => Boolean(polarSubscriptionId.value))

// Subscription sync runs only after order data yields a subscription id.
const {
  error: subscriptionError,
  status: subscriptionStatus,
  execute: executeSubscriptionSync,
} = useAsyncData(
  `polar-subscription-sync-${checkoutId}`,
  async () => {
    return polarSubscriptionId.value
      ? await paymentsStore.syncSubscriptionByPolarSubscriptionIdWithPolar(polarSubscriptionId.value)
      : null
  },
  { immediate: false },
)

// Trigger subscription sync when order is for recurring product
watch(polarSubscriptionId, async (value) => {
  if (!value)
    return

  await executeSubscriptionSync()
})

// Show the first failing sync error to keep messaging focused.
const errorMessage = computed(() => {
  if (orderStatus.value === 'error') {
    return orderError.value instanceof Error ? orderError.value.message : 'Unable to fetch order data.'
  }

  if (subscriptionStatus.value === 'error') {
    return subscriptionError.value instanceof Error
      ? subscriptionError.value.message
      : 'Unable to fetch subscription data.'
  }

  return null
})

// Treat order sync as complete when subscription sync is not needed.
const isComplete = computed(() => {
  if (!isSubscriptionSyncVisible.value) {
    return orderStatus.value === 'success'
  }

  return orderStatus.value === 'success' && subscriptionStatus.value === 'success'
})

// Enable navigation only after sync completes or fails.
const isActionEnabled = computed(() => isComplete.value
  || orderStatus.value === 'error'
  || subscriptionStatus.value === 'error')

async function retryOrderSync() {
  await executeOrderSync()
}

async function retrySubscriptionSync() {
  if (!polarSubscriptionId.value) {
    return
  }

  await executeSubscriptionSync()
}

onMounted(async () => {
  await executeOrderSync()
})
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <UAvatar
        icon="i-lucide-check"
        size="2xl"
        :ui="{ root: 'bg-success/25', icon: 'text-success-500' }"
      />
      <div class="space-y-1 mt-2">
        <h1 class="text-2xl font-bold">
          Success
        </h1>
        <p class="text-muted text-sm">
          Thank you for your purchase
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <PagePolarSuccessSyncStep
        label="Fetching order"
        :state="orderStatus"
        @retry="retryOrderSync"
      />
      <PagePolarSuccessSyncStep
        v-if="isSubscriptionSyncVisible"
        label="Fetching subscription"
        :state="subscriptionStatus"
        @retry="retrySubscriptionSync"
      />
    </div>

    <p
      v-if="errorMessage"
      class="text-error text-sm"
    >
      {{ errorMessage }}
    </p>

    <UButton
      :to="runtimeConfig.public.app.routes.home"
      :disabled="!isActionEnabled"
      block
    >
      Go To Home
    </UButton>
  </div>
</template>
