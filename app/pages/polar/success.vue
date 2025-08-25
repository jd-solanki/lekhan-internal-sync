<script lang="ts" setup>
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center min-h-dvh',
})

// // Commented out in case if you need to retrieve them
// const queryCheckoutId = getFirstQueryValue('checkout_id')
// const consumer_session_token = getFirstQueryValue('consumer_session_token')
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
    </div>
  </div>
</template>
