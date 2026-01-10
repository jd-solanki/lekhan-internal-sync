<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToggle } from '@vueuse/core'

const [isPasswordVisible, togglePasswordVisibility] = useToggle(false)

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

const userStore = useUserStore()

const state = reactive<Partial<SchemaResetPassword>>({
  token,
  password: process.env.NODE_ENV === 'development' ? 'adminadmin' : undefined,
})

async function onSubmit(event: FormSubmitEvent<SchemaResetPassword>) {
  await userStore.resetPassword(event.data)
}
</script>

<template>
  <div class="w-80">
    <AppLogo class="mx-auto size-12 my-2" />
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
          :type="isPasswordVisible ? 'text' : 'password'"
          size="xl"
          class="w-full"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="isPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
              :aria-pressed="isPasswordVisible"
              aria-controls="password"
              @click="togglePasswordVisibility()"
            />
          </template>
        </UInput>
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
