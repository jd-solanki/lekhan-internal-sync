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

type StepStatus = 'idle' | 'pending' | 'success' | 'error'

const orderStep = ref<{ status: StepStatus, error: string | null }>({
  status: 'idle',
  error: null,
})
const subscriptionStep = ref<{ status: StepStatus, error: string | null }>({
  status: 'idle',
  error: null,
})
const subscriptionIds = ref<string[]>([])

// Normalize errors into a consistent string.
function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback
}

// Sync order details and return subscription ids if any.
async function runOrderSync() {
  orderStep.value = { status: 'pending', error: null }

  try {
    const { syncedOrders } = await paymentsStore.syncOrderByCheckoutIdWithPolar(checkoutId)

    // Extract unique subscription IDs from synced orders.
    const ids = syncedOrders
      .map(order => order.polarSubscriptionId)
      .filter((id): id is string => Boolean(id))

    subscriptionIds.value = Array.from(new Set(ids))
    orderStep.value = { status: 'success', error: null }
  }
  catch (err) {
    orderStep.value = { status: 'error', error: getErrorMessage(err, 'Unable to fetch order data.') }
    subscriptionIds.value = []
  }
}

// Sync subscriptions sequentially for clearer retry behavior.
async function runSubscriptionSync() {
  if (subscriptionIds.value.length === 0) {
    subscriptionStep.value = { status: 'idle', error: null }
    return
  }

  subscriptionStep.value = { status: 'pending', error: null }

  for (const subscriptionId of subscriptionIds.value) {
    try {
      await paymentsStore.syncSubscriptionByPolarSubscriptionIdWithPolar(subscriptionId)
    }
    catch (err) {
      subscriptionStep.value = {
        status: 'error',
        error: `Subscription ${subscriptionId}: ${getErrorMessage(err, 'Unable to fetch subscription data.')}`,
      }
      return
    }
  }

  subscriptionStep.value = { status: 'success', error: null }
}

// Run the full flow in sequence: order sync -> subscription sync (if needed).
async function runSync() {
  await runOrderSync()
  if (subscriptionIds.value.length === 0)
    return

  await runSubscriptionSync()
}

// Show the first failing sync error to keep messaging focused.
const errorMessage = computed(() => orderStep.value.error ?? subscriptionStep.value.error)

// Treat sync as complete when all required steps succeed.
const isComplete = computed(() => {
  const hasSubscriptions = subscriptionStep.value.status !== 'idle'
  if (!hasSubscriptions)
    return orderStep.value.status === 'success'

  return orderStep.value.status === 'success' && subscriptionStep.value.status === 'success'
})

// Enable navigation only after sync completes or fails.
const isActionEnabled = computed(() => isComplete.value
  || orderStep.value.status === 'error'
  || subscriptionStep.value.status === 'error')

// Retry subscription sync using cached ids from order.
async function retrySyncSubscriptions() {
  await runSubscriptionSync()
}

onMounted(async () => {
  await runSync()
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
        :state="orderStep.status"
        @retry="runSync"
      />
      <PagePolarSuccessSyncStep
        v-if="subscriptionStep.status !== 'idle'"
        label="Fetching subscription"
        :state="subscriptionStep.status"
        @retry="retrySyncSubscriptions"
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
    <p class="text-dimmed max-w-sm text-center text-balance">
      <span>If you face any issues while fetching payment data, please </span>
      <ULink
        class="underline text-dimmed"
        :href="runtimeConfig.public.app.routes.support"
      >
        <span>contact support</span>
      </ULink>
      <span>.</span>
    </p>
  </div>
</template>
