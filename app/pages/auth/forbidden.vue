<script lang="ts" setup>
definePageMeta({
  isAuthRequired: false,
  layout: 'blank',
  mainClass: 'grid place-items-center',
})

const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <div class="max-w-prose text-center space-y-12">
    <div>
      <h1 class="text-primary">
        Access Denied
      </h1>
      <p>You do not have permission to view this page.</p>
    </div>

    <UButton
      :to="runtimeConfig.public.app.routes.home"
      class="ms-auto"
    >
      Go back home
    </UButton>
  </div>
</template>
