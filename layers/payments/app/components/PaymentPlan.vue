<script lang="ts" setup>
import type { PricingPlanProps } from '@nuxt/ui'
import type { ProductPriceFixed } from '@polar-sh/sdk/models/components/productpricefixed'

const paymentsStore = usePaymentsStore()

const { data: products } = await paymentsStore.fetchProducts()
const product = computed(() => products.value?.result.items[0])
const preDiscountPriceInCents = computed(() => {
  const metadata = product.value?.metadata || {}
  return extractPreDiscountInCentsFromMetadata(metadata)
})
const productPrice = computed(() => {
  if (!product.value) {
    throw new Error('Product not found')
  }
  return product.value.prices[0] as unknown as ProductPriceFixed
})

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'No products found',
  })
}

const isPaymentInProgress = ref(false)
const withLoading = createWithLoading(isPaymentInProgress)

// INFO: We'll not be using paymentsStore.buyProduct directly because we've other conditional logic
async function buyProduct(productId: string) {
  await paymentsStore.createCheckoutSession(productId)
}

const hasPurchasedProduct = await paymentsStore.hasPurchasedProduct(product.value.id)

const planDynamicProps = computed(() => {
  const props: PricingPlanProps = {}

  const formattedPrice = formatPolarAmount(productPrice.value.priceAmount)

  // Switch price & discount if pre-discount price exists
  if (preDiscountPriceInCents.value) {
    props.price = formatPolarAmount(preDiscountPriceInCents.value)
    props.discount = formattedPrice
  }
  else {
    props.price = formattedPrice
  }

  // Show Buy Now button only if user hasn't purchased the product
  if (!hasPurchasedProduct) {
    props.button = {
      label: 'Buy Now',
      loadingAuto: true,
      disabled: isPaymentInProgress.value,
      onClick: async () => await withLoading(async () => await buyProduct(product!.value!.id)),
    }
  }

  return props
})
</script>

<template>
  <UPricingPlan
    v-if="product"
    :ui="{ title: 'text-2xl!', root: 'p-8!', footer: hasPurchasedProduct ? 'items-start' : '' }"
    :title="product.name"
    :description="product.description || undefined"
    :features="extractProductFeaturesFromMetadata(product.metadata)"
    :badge="hasPurchasedProduct ? 'Current Plan' : undefined"
    v-bind="planDynamicProps"
  >
    <!--
      INFO: We intentionally added "Launch Offer Live" badge assuming You'll always have launch offer for initial launch
      As it helps with initial sales
    -->
    <template
      v-if="!hasPurchasedProduct"
      #badge
    >
      <UBadge
        variant="outline"
        size="lg"
        class="ms-auto"
        :ui="{ base: 'ring-accented rounded-full px-4 gap-2' }"
      >
        <span class="relative flex size-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span>Launch Offer</span>
      </UBadge>
    </template>
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
