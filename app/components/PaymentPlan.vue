<script lang="ts" setup>
import type { ProductPriceFixed } from '@polar-sh/sdk/models/components/productpricefixed'

const { data: products } = await useFetch('/api/polar/products')
const product = computed(() => products.value?.result.items[0])

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'No products found',
  })
}

const paymentsStore = usePaymentsStore()
const isPaymentInProgress = ref(false)
const withLoading = createWithLoading(isPaymentInProgress)

// INFO: We'll not be using paymentsStore.buyProduct directly because we've other conditional logic
async function buyProduct(productId: string) {
  await paymentsStore.createCheckoutSession(productId)
}

const hasPurchasedProduct = await paymentsStore.hasPurchasedProduct(product.value.id)
</script>

<template>
  <UPricingPlan
    v-if="product"
    :ui="{ title: 'text-2xl!', root: 'p-8!', footer: hasPurchasedProduct ? 'items-start' : '' }"
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
            onClick: async () => await withLoading(async () => await buyProduct(product!.id)),
          },
        } : {}
      ),
    }"
  >
    <template #terms>
      <div class="flex gap-2 text-pretty text-start text-sm">
        <UIcon
          name="i-lucide-shield-check"
          class="shrink-0 h-lh"
        />
        <p>Billing is securely managed via Polar Payment Platform</p>
      </div>
    </template>
  </UPricingPlan>
</template>
