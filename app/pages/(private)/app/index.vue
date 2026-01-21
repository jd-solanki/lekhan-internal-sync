<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

definePageMeta({
  search: {
    label: 'Dashboard',
    icon: 'i-lucide-home',
  },
})

const paymentsStore = usePaymentsStore()
const billingInterval = ref<'month' | 'year'>('month')

// Keep toggle data minimal for testing page.
const billingTabs: TabsItem[] = [
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' },
]

// Filter recurring products to match the selected billing interval.
const monthlyRecurringProducts = computed(() => paymentsStore.recurringProducts
  .filter(product => product.recurringInterval === 'month'))
const yearlyRecurringProducts = computed(() => paymentsStore.recurringProducts
  .filter(product => product.recurringInterval === 'year'))
const visibleRecurringProducts = computed(() => (billingInterval.value === 'year'
  ? yearlyRecurringProducts.value.toSorted((a, b) => a.name.localeCompare(b.name))
  : monthlyRecurringProducts.value.toSorted((a, b) => a.name.localeCompare(b.name))))
</script>

<template>
  <div>
    <AppPageHeader title="Dashboard" />
    <UTabs
      v-model="billingInterval"
      :items="billingTabs"
      :content="false"
      class="mb-4 w-full max-w-xs"
    />
    <div class="md:w-2/3">
      <PricingPlans
        compact
        :products="visibleRecurringProducts"
      />
    </div>
    <PricingPlans
      compact
      :products="monthlyRecurringProducts"
    />
    <div class="md:w-1/2">
      <PricingPlans
        compact
        :products="paymentsStore.oneTimeProducts"
      />
    </div>
  </div>
</template>
