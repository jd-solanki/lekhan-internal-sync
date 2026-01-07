<script lang="ts" setup>
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
</script>

<template>
  <div>
    <!-- Header -->
    <LayoutDocsHeader :navigation="navigation_docs" />

    <!-- Main -->
    <UMain>
      <UContainer>
        <UPage>
          <!-- Navigation -->
          <template #left>
            <UPageAside>
              <LayoutDocsContentNavigation :navigation="navigation_docs" />
            </UPageAside>
          </template>
          <slot />
        </UPage>
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
