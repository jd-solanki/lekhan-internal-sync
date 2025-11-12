<script lang="ts" setup>
import { useCounter, useIntervalFn, useTimeoutFn } from '@vueuse/core'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
})

// // Commented out in case if you need to retrieve them
// const queryCheckoutId = getFirstQueryValue('checkout_id')
// const consumer_session_token = getFirstQueryValue('consumer_session_token')

const runtimeConfig = useRuntimeConfig()

const { count, dec } = useCounter(5, { min: 0 })
useIntervalFn(dec)

useTimeoutFn(async () => {
  await navigateTo(runtimeConfig.public.app.routes.billing, { replace: true })
}, 5000)
</script>

<template>
  <div class="text-center space-y-6">
    <UAvatar
      icon="lucide:check"
      size="2xl"
      :ui="{ root: 'bg-success/25', icon: 'text-success-500' }"
    />
    <div>
      <h1 class="text-2xl font-bold">
        Payment Successful
      </h1>
      <p class="mt-2">
        Thank you for your purchase
      </p>
      <p class="mt-6 text-muted text-sm">
        Redirecting to home page in {{ count }}...
      </p>
    </div>
  </div>
</template>
