<script lang="ts" setup>
definePageMeta({
  layout: 'website',
})

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('legal').path(route.path).first()
})

if (!page.value) {
  throw createError({ status: 404, message: 'Page not found' })
}
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <UPageHeader :title="page.title" />

      <!-- INFO: Pass runtimeConfig to markdown  -->
      <ContentRenderer :value="page" />
    </UPage>
  </UContainer>
</template>
