<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  redirectIfSignedIn: true,
  isAuthRequired: false,
})

const appConfig = useAppConfig()
const userStore = useUserStore()
const route = useRoute()

const state = reactive<Partial<SchemaForgotPassword>>({
  email: process.env.NODE_ENV === 'development' ? 'admin@mail.com' : undefined,
})
const uiState = ref(route.query.state)

async function onSubmit(event: FormSubmitEvent<SchemaForgotPassword>) {
  await userStore.sendResetPasswordLink(event.data)
    .then(() => {
      uiState.value = 'mail-sent'
    })
    .catch(() => {
      uiState.value = undefined
    })
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
      {{ uiState === 'mail-sent' ? 'Success' : 'Forgot Password' }}
    </h1>
    <p class="text-muted text-center">
      {{ uiState === 'mail-sent' ? 'Email sent successfully' : 'Enter email to receive reset password link' }}
    </p>

    <p
      v-if="uiState === 'mail-sent'"
      class="text-center my-10 text-balance"
    >
      Please check your inbox for reset password link
    </p>

    <template v-if="!uiState">
      <UForm
        :schema="schemaForgotPassword"
        :state="state"
        class="space-y-6 my-10"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            autofocus
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
          Submit
        </UButton>
      </UForm>

      <p class="text-sm text-center">
        <span class="text-muted">Remembered your password?</span>
        <ULink
          to="/auth/sign-in"
          class="hover:underline"
        >
          Sign In
        </ULink>
      </p>
    </template>
  </div>
</template>
