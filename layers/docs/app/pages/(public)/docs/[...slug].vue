<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs',
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation_docs')

const route = useRoute()

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(route.path, () => queryCollection('docs').path(route.path).first()),
  useAsyncData(`${route.path}-surround`, () => {
    return queryCollectionItemSurroundings('docs', route.path, {
      fields: ['description'],
    })
  }),
])

if (!page.value) {
  throw createError({ status: 404, statusText: 'Page not found' })
}

// Title & Headline
const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})
</script>

<template>
  <UPage v-if="page">
    <template #left>
      <UPageAside>
        <LayoutDocsContentNavigation :navigation="navigation" />
      </UPageAside>
    </template>

    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    >
      <!-- <template #links>
        <UButton
          v-for="(link, index) in (page as DocsCollectionItem).links"
          :key="index"
          size="sm"
          v-bind="link"
        />

        <DocsPageHeaderLinks />
      </template> -->
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />
      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        highlight
        :links="page.body?.toc?.links"
      />
    </template>
  </UPage>
</template>
