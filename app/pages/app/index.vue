<script lang="ts" setup>
const paymentStatus = getFirstQueryValue('paymentStatus')
const { successToast } = useToastMessage()
const route = useRoute()

if (paymentStatus === 'success') {
  onMounted(() => {
    successToast({
      title: 'Payment Successful',
      description: 'Thank you for your purchase!',
    })
  })

  // Remove query params after showing success toast
  // UX: Replace the previous route so if user tries to go back it don't land of same path having query params
  navigateTo(route.path, { replace: true })
}
</script>

<template>
  <div>
    <AppPageHeader title="Dashboard" />
  </div>
</template>
