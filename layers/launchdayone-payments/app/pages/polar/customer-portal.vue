<script lang="ts" setup>
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
})

const appConfig = useAppConfig()
onMounted(async () => {
  await authClient.customer.portal()
})
</script>

<template>
  <div>
    <NuxtImg
      :src="appConfig.app.logoUrl"
      class="mx-auto size-12 my-2"
      :class="appConfig.app.logoClass"
    />
    <p>You'll get redirected to customer portal shortly...</p>
  </div>
</template>
