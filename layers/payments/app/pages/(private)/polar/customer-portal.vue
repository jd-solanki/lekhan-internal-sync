<script lang="ts" setup>
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
})

onMounted(async () => {
  await authClient.customer.portal()
})
</script>

<template>
  <div>
    <AppLogo class="mx-auto size-12 my-2" />
    <p>You'll get redirected to customer portal shortly...</p>
  </div>
</template>
