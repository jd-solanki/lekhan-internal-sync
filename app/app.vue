<script lang="ts" setup>
showFlashMessageFromCookie()
showVersionUpdatedToast()

const route = useRoute()
const userStore = useUserStore()
const bannerStore = useBannerStore()
const runtimeConfig = useRuntimeConfig()

const seoTitle = computed(() => {
  return genPageTitleFromRoutePath(route, runtimeConfig.public.app.name, runtimeConfig.public.app.name)
})

useSeoMeta({
  title: () => seoTitle.value.pageTitle,
})

defineOgImageComponent('NuxtSeo', {
  title: () => seoTitle.value.ogImageTitle,
  theme: '#ffffff',
  colorMode: 'dark',
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <!--
      Clever way to show existing banner and impersonating banner without adding complexity
      Instead of adding complexity create two separate banner and make impersonating banner overlap existing one

      This will hide main banner behind impersonating when admin is impersonating user.
      When admin stop impersonating underlying banner will appear without managing any dynamic state & storing main banner state it in cookie.

      Also as we added v-if for userSession to impersonating banner, it automatically gets removed when admin sign out while impersonating.
    -->
    <AuthUserImpersonatingBanner
      v-if="userStore.userSession?.impersonatedBy && userStore.user"
      :name="userStore.user.name || userStore.user.email"
      :stop-impersonation-handler="userStore.stopImpersonating"
    />
    <UBanner
      v-else-if="bannerStore.props.title"
      v-bind="bannerStore.props"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
