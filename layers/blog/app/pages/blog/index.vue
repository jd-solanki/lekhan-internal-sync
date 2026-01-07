<script setup lang="ts">
definePageMeta({
  layout: 'blog',
  isAuthRequired: false,
})

const runtimeConfig = useRuntimeConfig()

const { data: posts } = await useAsyncData(
  'blog',
  () => queryCollection('blog').all(),
)
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <UPageHeader
          :title="`The ${runtimeConfig.public.app.name} Blog`"
          description="Read the latest news, releases, tutorials, and more."
          :ui="{ root: 'border-none' }"
          class="mb-12"
        />
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
