<script lang="ts" setup>
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const routePath = withoutTrailingSlash(route.path)

const [{ data: post }, { data: surround }] = await Promise.all([
  useAsyncData(routePath, () => {
    return queryCollection('blog').path(routePath).first()
  }),
  useAsyncData(`${routePath}-surround`, () => {
    return queryCollectionItemSurroundings('blog', routePath, {
      fields: ['description'],
    })
  }),
])

if (!post.value) {
  throw createError({ status: 404, statusText: 'Blog Post not found' })
}

// SEO
useSeoMeta({
  title: post.value.title,
  ogTitle: post.value.title,
  description: post.value.description,
  ogDescription: post.value.description,
  ogType: 'article',
})
</script>

<template>
  <UPage v-if="post">
    <UPageHeader
      :title="post.title"
      :description="post.description"
      :ui="{ headline: 'flex flex-col gap-y-8 items-start' }"
    >
      <template #headline>
        <UBreadcrumb
          :items="[{ label: 'Blog', icon: 'i-lucide-newspaper', to: '/blog' }, { label: post.title }]"
          class="max-w-full"
        />
        <div class="flex items-center space-x-2">
          <span>
            {{ post.category }}
          </span>
          <span class="text-muted">&middot;&nbsp;&nbsp;<time>{{ formatDateByLocale('en', post.date) }}</time></span>
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer :value="post" />
    </UPageBody>

    <UContentSurround :surround="surround" />
    <template #right>
      <UContentToc
        v-if="post.body.toc"
        :links="post.body.toc.links"
        highlight
        color="neutral"
      />
    </template>
  </UPage>
</template>
