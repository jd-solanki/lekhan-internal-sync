<script lang="ts" setup>
definePageMeta({
  search: {
    label: 'Billing',
    icon: 'i-lucide-credit-card',
  },
})

const paymentsStore = usePaymentsStore()
const products = computed(() => paymentsStore.recurringProducts)
const productIds = computed(() => products.value.map(p => p.id))

// Use a friendly label for scheduled cancellation.
const cancelDateLabel = computed(() => {
  const currentPeriodEnd = paymentsStore.activeSubscription?.currentPeriodEnd
  if (!currentPeriodEnd) {
    return 'the end of the current period'
  }

  return formatDateByLocale('en-US', currentPeriodEnd)
})

const hasPurchasedProduct = paymentsStore.hasPurchasedProduct(productIds.value)
</script>

<template>
  <div>
    <UAlert
      v-if="paymentsStore.isSubscriptionPendingCancel"
      color="warning"
      variant="subtle"
      title="Subscription scheduled to cancel"
      :description="`Your subscription will end on ${cancelDateLabel}. Resume to keep access.`"
      class="mb-6"
    >
      <template #actions>
        <UButton
          label="Resume Subscription"
          color="warning"
          loading-auto
          @click="paymentsStore.resumeSubscription"
        />
      </template>
    </UAlert>
    <AppPageHeader
      title="Billing"
      description="Manage your billing information here"
    />
    <PricingPlans
      :products="paymentsStore.recurringProducts"
      compact
      class="max-w-6xl"
    />
    <UAlert
      color="success"
      variant="subtle"
      title="You won't be charged"
      description="Payments are sandboxed in demo. Use test card number '4242 4242 4242 4242' with any future expiry and CVC."
      icon="i-lucide-info"
      class="mt-10"
    />
    <UAlert
      v-if="hasPurchasedProduct"
      title="You can download invoice & access entitlements from Polar Customer Portal."
      variant="subtle"
      color="info"
      class="mt-10"
      :actions="[
        {
          label: 'Go to Portal',
          to: '/polar/customer-portal',
          variant: 'outline',
          color: 'info',
          trailingIcon: 'i-lucide-arrow-up-right',
        },
      ]"
    />
  </div>
</template>
