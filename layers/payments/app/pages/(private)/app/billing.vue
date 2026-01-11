<script lang="ts" setup>
definePageMeta({
  search: {
    label: 'Billing',
    icon: 'i-lucide-credit-card',
  },
})

const paymentsStore = usePaymentsStore()

const { data: products } = await paymentsStore.fetchProducts()
const product = computed(() => products.value?.result.items[0])

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'No products found',
  })
}

// Ensure customer state is loaded and authenticated user is customer
// This won't be the case because customer always gets created on sign up
if (!paymentsStore.customerState?.id) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Customer not found. Please ensure you have a valid customer profile before accessing billing information.',
  })
}

const hasPurchasedProduct = await paymentsStore.hasPurchasedProduct(product.value.id)
const userOrders = await paymentsStore.fetchUserOrdersForProduct(product.value.id)
const userOrder = computed(() => {
  return userOrders?.result.items[0] || null
})
</script>

<template>
  <div>
    <AppPageHeader
      title="Billing"
      description="Manage your billing information here"
    />
    <div class="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">
      <PaymentPlan />
    </div>
    <div
      v-if="hasPurchasedProduct"
      class="mt-10"
    >
      <UCard>
        <template #header>
          <div class="flex flex-wrap gap-2 justify-between items-center">
            <h4 class="text-lg font-semibold">
              Payment Information
            </h4>
            <div class="flex items-center gap-2">
              <UButton
                variant="outline"
                color="neutral"
                icon="i-lucide-external-link"
                trailing
                label="Download Invoice & View Benefits"
                to="/polar/customer-portal"
                target="_blank"
              />
              <UTooltip
                :delay-duration="0"
                text="Download invoice from order details"
                :content="{ sideOffset: 12 }"
              >
                <UIcon
                  name="i-lucide-info"
                  class="text-muted"
                />
              </UTooltip>
            </div>
          </div>
        </template>

        <div
          v-if="userOrder"
          class="grid sm:grid-cols-2 gap-8"
        >
          <!-- Left: Payment Details -->
          <div class="space-y-4">
            <div>
              <p class="text-sm text-muted">
                Product Name
              </p>
              <p class="font-medium">
                {{ userOrder.product?.name }}
              </p>
            </div>

            <div>
              <p class="text-sm text-muted">
                Purchase Date
              </p>
              <p class="font-medium">
                {{ new Date(userOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
            </div>

            <div>
              <p class="text-sm text-muted">
                Transaction ID
              </p>
              <p class="font-medium font-mono">
                {{ userOrder.id }}
              </p>
            </div>
          </div>

          <!-- Right: Polar Benefits -->
          <div>
            <h5 class="font-semibold mb-4">
              Product Features
            </h5>
            <ul class="space-y-3">
              <li
                v-for="feature in extractProductFeaturesFromMetadata(userOrder.product?.metadata)"
                :key="feature"
                class="flex items-start gap-2"
              >
                <UIcon
                  name="i-lucide-check"
                  class="text-green-500 mt-0.5 shrink-0"
                />
                <span class="text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
