<script lang="ts" setup>
definePageMeta({
  layout: 'website',
  isAuthRequired: false,
})

const runtimeConfig = useRuntimeConfig()

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('legal').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" />

    <!-- INFO: Pass runtimeConfig to markdown  -->
    <ContentRenderer
      :value="page"
      :data="{ runtimeConfig }"
    />
  </UPage>
</template>
