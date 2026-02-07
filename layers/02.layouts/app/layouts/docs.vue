<script lang="ts" setup>
const route = useRoute()
const isBlogPage = computed(() => route.path.startsWith('/blog'))

const [{ data: navigation_docs }, { data: navigation_blog }] = await Promise.all([
  useAsyncData(
    () => `navigation_docs`,
    () => queryCollectionNavigation('docs'),
    {
      transform: data => data.find(item => item.path === '/docs')?.children || data || [],
      default: () => [],
    },
  ),
  useAsyncData(
    () => `navigation_blog`,
    () => queryCollectionNavigation('blog'),
    {
      transform: data => data.find(item => item.path === '/blog')?.children || data || [],
      default: () => [],
    },
  ),
])

const { data: files } = useLazyAsyncData(
  `search_docs`,
  () => queryCollectionSearchSections('docs'),
  {
    server: false,
    default: () => [],
  },
)

const { data: files_blog } = useLazyAsyncData(
  `search_blog`,
  () => queryCollectionSearchSections('blog'),
  {
    server: false,
    default: () => [],
  },
)

provide('navigation_docs', navigation_docs)
</script>

<template>
  <div class="flex flex-col min-h-svh">
    <!-- Header -->
    <LayoutDocsHeader :navigation="isBlogPage ? [] : navigation_docs" />

    <!--
      Added `min-h-auto` to remove calculated min-height
      Related: https://github.com/nuxt/ui/issues/4955
    -->
    <UMain
      :class="[route.meta.mainClass]"
      class="min-h-auto grow"
    >
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <!-- Footer -->
    <LayoutDocsFooter />

    <!-- Search -->
    <ClientOnly>
      <LazyUContentSearch
        :files="[...files, ...files_blog]"
        :navigation="[
          ...navigation_docs,
          { title: 'Blog', path: '/blog', page: false, children: navigation_blog },
        ]"
      />
    </ClientOnly>
  </div>
</template>
