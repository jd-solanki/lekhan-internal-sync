<script lang="ts" setup>
import type { PricingPlanProps, PricingPlansProps, PricingPlansSlots } from '@nuxt/ui'
import type { InternalApi } from 'nitropack'
import { determinePlanChangeType, extractTierOrderFromMetadata, normalizeToMonthlyPrice } from '~~/layers/payments/shared/utils/pricing'

interface Props extends PricingPlansProps {
  products: InternalApi['/api/polar/products']['get']['products']
}
const props = defineProps<Props>()

defineSlots<PricingPlansSlots>()

const paymentsStore = usePaymentsStore()
const isPaymentInProgress = ref(false)
const withLoading = createWithLoading(isPaymentInProgress)

// Sort products by tier order to keep plan display consistent.
const sortedProduct = computed(() => [...props.products].sort((first, second) => {
  const firstTier = extractTierOrderFromMetadata(first.metadata || {})
  const secondTier = extractTierOrderFromMetadata(second.metadata || {})

  return firstTier - secondTier
}))

// Get current subscription product to access tier metadata
const currentSubscriptionProduct = computed(() => {
  const subscription = paymentsStore.activeSubscription
  if (!subscription) {
    return null
  }

  return paymentsStore.recurringProducts.find(p => p.id === subscription.productId)
})

type DefaultPrice = NonNullable<Props['products'][number]['prices'][number]> | undefined

interface PriceDetails {
  formattedPrice: string
  preDiscountPriceInCents: number | null
  productMonthlyAmount: number
}

function getPriceDetails(product: Props['products'][number], defaultPrice: DefaultPrice): PriceDetails {
  // Keep pricing logic centralized so plans stay readable.
  const rawPreDiscountInCents = extractPreDiscountInCentsFromMetadata(product.metadata || {})
  const rawPriceAmount = defaultPrice && 'priceAmount' in defaultPrice
    ? defaultPrice.priceAmount as number
    : 0
  // Show yearly prices as monthly amounts to keep plans comparable.
  const productMonthlyAmount = normalizeToMonthlyPrice(rawPriceAmount, product.recurringInterval)
  const formattedPrice = defaultPrice && 'priceAmount' in defaultPrice
    ? formatPolarAmount(productMonthlyAmount)
    : 'Custom'
  const preDiscountPriceInCents = rawPreDiscountInCents
    ? normalizeToMonthlyPrice(rawPreDiscountInCents, product.recurringInterval)
    : null

  return {
    formattedPrice,
    preDiscountPriceInCents,
    productMonthlyAmount,
  }
}

function buildPlanPricing(plan: PricingPlanProps, priceDetails: PriceDetails) {
  // Show pre-discount price when metadata defines a discount.
  if (priceDetails.preDiscountPriceInCents) {
    plan.price = formatPolarAmount(priceDetails.preDiscountPriceInCents)
    plan.discount = priceDetails.formattedPrice
    return
  }

  plan.price = priceDetails.formattedPrice
}

function buildPlanButton(plan: PricingPlanProps, product: Props['products'][number], priceDetails: PriceDetails, hasPurchasedProduct: boolean, isCurrentPlan: boolean) {
  // Keep button rules together to make the purchase flow easy to scan.
  if (!product.isRecurring) {
    // One-time purchase: show a buy button only if user never bought it.
    if (!hasPurchasedProduct) {
      plan.button = {
        label: 'Buy Now',
        loadingAuto: true,
        disabled: isPaymentInProgress.value,
        onClick: async () => await withLoading(async () => await paymentsStore.buyProduct(product.id)),
      }
    }
    return
  }

  if (isCurrentPlan) {
    // Active subscription on this plan: direct user to manage billing.
    plan.badge = 'Current Plan'
    plan.button = {
      label: 'Manage',
      to: '/polar/customer-portal',
      target: '_blank',
    }
    return
  }

  if (paymentsStore.activeSubscription) {
    if (paymentsStore.isSubscriptionPendingCancel) {
      // Block plan changes until user resumes subscription.
      plan.button = {
        label: 'Resume to Switch',
        disabled: true,
      }
      return
    }

    // Switching from another plan: use tier-based comparison.
    const currentProduct = currentSubscriptionProduct.value
    if (!currentProduct) {
      throw new Error('Active subscription product not found in recurring products')
    }

    const currentTier = extractTierOrderFromMetadata(currentProduct.metadata || {})
    const targetTier = extractTierOrderFromMetadata(product.metadata || {})

    const changeType = determinePlanChangeType(
      currentTier,
      paymentsStore.activeSubscription.recurringInterval,
      targetTier,
      product.recurringInterval,
    )

    const isUpgrade = changeType === 'upgrade'

    plan.button = {
      label: isUpgrade ? 'Upgrade' : 'Downgrade',
      loadingAuto: true,
      disabled: isPaymentInProgress.value,
      onClick: async () => await withLoading(async () => await paymentsStore.changePlan(product.id, !isUpgrade)),
    }
    return
  }

  if (!hasPurchasedProduct) {
    // New recurring customer: allow subscription purchase.
    plan.button = {
      label: 'Subscribe',
      loadingAuto: true,
      disabled: isPaymentInProgress.value,
      onClick: async () => await withLoading(async () => await paymentsStore.buyProduct(product.id)),
    }
  }
}

// Build plans from sorted products for consistent tier ordering.
const plans = computed(() => sortedProduct.value.map((product) => {
  const hasPurchasedProduct = paymentsStore.hasPurchasedProduct([product.id])
  const isCurrentPlan = paymentsStore.hasActiveSubscription([product.id])
  const defaultPrice = product.prices[0]
  const priceDetails = getPriceDetails(product, defaultPrice)

  const plan: PricingPlanProps = {
    // Yearly plans show monthly billing label to match normalized price.
    billingCycle: product.recurringInterval === 'year'
      ? '/month'
      : product.recurringInterval
        ? `/${product.recurringInterval}`
        : undefined,
    title: product.name,
    description: product.description || undefined,
    features: extractProductFeaturesFromMetadata(product.metadata || {}),

    // Highlight preferred options from metadata to guide buyer choice.
    scale: product.metadata._ui_scale === 'true',
    highlight: product.metadata._ui_highlight === 'true',
  }

  buildPlanPricing(plan, priceDetails)
  buildPlanButton(plan, product, priceDetails, hasPurchasedProduct, isCurrentPlan)

  return plan
}))
</script>

<template>
  <UPricingPlans
    v-bind="props"
    :plans="plans"
  >
    <!-- Iterate through all slots passed to WrapperComponent -->
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <!-- Render the slot with its name and props for the ChildComponent -->
      <slot
        :name="slotName"
        v-bind="slotProps"
      />
    </template>
  </UPricingPlans>
</template>
