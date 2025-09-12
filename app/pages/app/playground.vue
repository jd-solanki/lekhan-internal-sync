<script lang="ts" setup>
const bannerStore = useBannerStore()

function toggleBanner() {
  bannerStore.props.title = bannerStore.props.title ? undefined : 'Hey there 👋🏻'
}
</script>

<template>
  <div>
    <AppPageHeader
      title="Playground"
      description="Experiment with your ideas here!"
    />
    <div class="space-y-6">
      <UButton @click="toggleBanner">
        Toggle Banner
      </UButton>

      <UBanner title="Banner in page." />

      <div class="bg-muted h-[900px] rounded-xl" />
    </div>
  </div>
</template>
