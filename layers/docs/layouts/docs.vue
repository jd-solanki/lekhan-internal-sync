<script lang="ts" setup>
const { data: navigation } = await useAsyncData(
  () => `navigation_docs`,
  () => queryCollectionNavigation('docs'),
  {
    transform: data => data.find(item => item.path === '/docs')?.children || data || [],
  },
)

const { data: files } = useLazyAsyncData(
  `search_docs`,
  () => queryCollectionSearchSections('docs'),
  {
    server: false,
  },
)

provide('navigation', navigation)
</script>

<template>
  <div>
    <!-- Header -->
    <DocsHeader />

    <!-- Main -->
    <UMain>
      <UContainer>
        <UPage>
          <!-- Navigation -->
          <template #left>
            <UPageAside>
              <DocsContentNavigation :navigation />
            </UPageAside>
          </template>
          <slot />
        </UPage>
      </UContainer>
    </UMain>

    <!-- Footer -->
    <DocsFooter />

    <!-- Search -->
    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </div>
</template>
