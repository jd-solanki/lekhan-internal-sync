<script lang="ts" setup>
import type { ProductPriceFixed } from '@polar-sh/sdk/models/components/productpricefixed'

const { data: products } = await useFetch('/api/polar/products')
const paymentsStore = usePaymentsStore()

const { data: userOrders } = await useFetch('/api/polar/orders', {
  query: {
    productId: products.value?.result.items[0]?.id,
  },
})

const userOrder = computed(() => userOrders.value?.result.items[0])

const isPaymentInProgress = ref(false)
const withLoading = createWithLoading(isPaymentInProgress)

async function buyProduct(productId: string) {
  await paymentsStore.createCheckoutSession(productId)
}

function extractProductFeaturesFromMetadata(metadata: any) {
  // Loop over metadata keys and if key starts with 'feature_' then its a feature
  return Object.keys(metadata).reduce((features: string[], key) => {
    if (key.startsWith('feature_')) {
      features.push(metadata[key])
    }
    return features
  }, [])
}

const hasPurchasedProduct = computed(() => {
  return !!userOrders.value?.result.items.length
})
</script>

<template>
  <div>
    <AppPageHeader
      title="Billing"
      description="Manage your billing information here."
    />
    <UAlert
      v-if="!userOrder"
      color="info"
      icon="i-lucide-shopping-bag"
      variant="subtle"
      title="You haven't made a purchase yet."
      class="mb-6"
      description="Demo is using sandbox environment so you can test without real payments using dummy credit card number."
    />
    <div class="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">
      <UPricingPlans>
        <UPricingPlan
          v-for="product in products?.result.items"
          :key="product.id"
          :ui="{ title: 'text-2xl!', root: 'p-8!', footer: userOrder ? 'items-start' : '' }"
          :title="product.name"
          :description="product.description || undefined"
          :price="formatPolarAmount((product.prices[0] as unknown as ProductPriceFixed).priceAmount)"
          :features="extractProductFeaturesFromMetadata(product.metadata)"
          :badge="hasPurchasedProduct ? 'Current Plan' : undefined"
          v-bind="{
            ...(
              !hasPurchasedProduct ? {
                button: {
                  label: 'Buy Now',
                  loadingAuto: true,
                  disabled: isPaymentInProgress,
                  onClick: async () => await withLoading(async () => await buyProduct(product.id)),
                },
              } : {}
            ),
          }"
        >
          <template #terms>
            <div class="flex gap-2 text-pretty text-start text-sm">
              <UIcon
                name="i-lucide-shield-check"
                class="shrink-0 h-[1lh]"
              />
              <p>Billing is securely managed via Polar Payment Platform</p>
            </div>
          </template>
        </UPricingPlan>
      </UPricingPlans>
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
                  class="text-green-500 mt-0.5 flex-shrink-0"
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
