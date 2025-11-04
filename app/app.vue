<script lang="ts" setup>
showFlashMessageFromCookie()
showVersionUpdatedToast()

const userStore = useUserStore()
const bannerStore = useBannerStore()
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <!--
      Clever way to show existing banner and impersonating banner without adding complexity
      Instead of adding complexity create two separate banner and make impersonating banner overlap existing one

      This will hide main banner behind impersonating when admin is impersonating user.
      When admin stop impersonating underlying banner will appear without managing any dynamic state & storing main banner state it in cookie.

      Also as we added v-if for userSession to impersonating banner, it automatically gets removed when admin sign out while impersonating.
    -->
    <UserImpersonatingBanner
      v-if="userStore.userSession?.impersonatedBy"
      class="sticky top-0"
    />
    <UBanner
      v-else-if="bannerStore.props.title"
      v-bind="bannerStore.props"
      class="sticky top-0 z-[60]"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
