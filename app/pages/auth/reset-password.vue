<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  redirectIfSignedIn: true,
  isAuthRequired: false,
  requiredQueryParamsOrRedirect: {
    token: {
      // Redirect to forgot password page if token is not present in query params
      redirectUrl: `/auth/forgot-password`,
      errorMessage: 'Unable to proceed with password reset due to malformed URL. Please try resetting your password again.',
      redirectOptions: {
        // UX: Replace current route to avoid getting stuck on forgot password page if user tries to go back
        replace: true,
      },
    },
  },
})

// We're forcing the token query param to be present
// Because we already defined the requiredQueryParamsOrRedirect in definePageMeta
const token = getFirstQueryValue('token')!

const appConfig = useAppConfig()
const userStore = useUserStore()

const state = reactive<Partial<SchemaResetPassword>>({
  token,
  password: undefined,
  // password: 'adminadmin',
})

async function onSubmit(event: FormSubmitEvent<SchemaResetPassword>) {
  await userStore.resetPassword(event.data)
}
</script>

<template>
  <div class="w-80">
    <NuxtImg
      :src="appConfig.app.logoUrl"
      class="mx-auto size-12 my-2"
      :class="appConfig.app.logoClass"
    />
    <h1 class="font-bold text-2xl leading-10 text-center">
      Reset Password
    </h1>
    <p class="text-muted text-center">
      Enter your new password to reset your account password.
    </p>

    <UForm
      :schema="schemaResetPassword"
      :state="state"
      class="space-y-6 my-10"
      @submit="onSubmit"
    >
      <UFormField
        label="Password"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UButton
        type="submit"
        block
        size="lg"
        :disabled="userStore.isLoading"
        loading-auto
      >
        Reset Password
      </UButton>
    </UForm>

    <p class="text-sm text-center">
      <span class="text-muted">Need new reset link?</span>
      <ULink
        to="/auth/forgot-password"
        class="hover:underline"
      >
        Forgot Password
      </ULink>
    </p>
  </div>
</template>
