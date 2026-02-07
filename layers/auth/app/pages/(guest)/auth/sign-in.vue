<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  // Render betterAuth errors via toast
  flashMessageErrorQueryAlias: 'error',
})

/*
  Only relevant for guest checkouts

  We added this in sign in page when magic link is used and successful guest checkout redirects to sign in page.
  This is because when magic link is used, there's no sign up page.
*/
informSignUpToAccessEntitlementsOnSuccessfulGuestCheckout()
</script>

<template>
  <div>
    <AuthMethodsPassword />
  </div>
</template>
