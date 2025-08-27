<script setup lang="ts">
import { authClient } from '~/libs/auth'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center min-h-dvh',
  isAuthRequired: false,
})

const paymentsStore = usePaymentsStore()

const { data: product } = await useFetch(
  '/api/polar/products',

  // Extract only first item as its one-time single plan purchase
  { transform: data => data.result.items[0] },
)

async function createCheckoutSession() {
  if (!product.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'No product found. Please create a product in the Polar dashboard.',
    })
  }

  paymentsStore.createCheckoutSession(product.value.id)
}
</script>

<template>
  <div class="space-x-4">
    <h1 class="text-3xl font-bold mb-12">
      Welcome
    </h1>
    <UButton to="/auth/sign-in">
      Sign In
    </UButton>
    <UButton to="/app">
      App
    </UButton>
    <UButton @click="createCheckoutSession">
      Buy Now at ${{ (product?.prices[0]?.priceAmount / 100).toFixed(2) }}
    </UButton>
  </div>
</template>
