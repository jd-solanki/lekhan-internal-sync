<script lang="ts" setup>
const paymentStatus = getFirstQueryValue('paymentStatus')
const { successToast } = useToastMessage()

if (paymentStatus === 'success') {
  onMounted(() => {
    successToast({
      title: 'Payment Successful',
      description: 'Thank you for your purchase!',
    })
  })
}
</script>

<template>
  <div>
    <h1>Dashboard Page</h1>
  </div>
</template>
