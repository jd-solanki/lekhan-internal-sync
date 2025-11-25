<script setup lang="ts">
definePageMeta({
  layout: 'website',
  isAuthRequired: false,
  mainClass: 'bg-(--ui-bg-muted) top-(--app-banner-height,0) dark:bg-black',
})
</script>

<template>
  <UPage class="space-x-4">
    <PageWebsiteIndexHero />
    <PageWebsiteIndexTestimonial />
    <PageWebsiteIndexFeatures />
    <PageWebsiteIndexComingSoon class="my-30" />
    <PageWebsiteIndexPricing />
  </UPage>
</template>
