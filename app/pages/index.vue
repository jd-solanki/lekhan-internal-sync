<script setup lang="ts">
definePageMeta({
  layout: 'website',
  isAuthRequired: false,
  mainClass: 'top-(--app-banner-height,0)',
})
</script>

<template>
  <UPage class="space-x-4">
    <PageWebsiteIndexHero />
    <PageWebsiteIndexTestimonial />
    <PageWebsiteIndexFeatures />
    <PageWebsiteIndexComingSoon class="my-30" />
    <PageWebsiteIndexPricing />
    <PageWebsiteIndexFAQs class="my-20" />
  </UPage>
</template>
