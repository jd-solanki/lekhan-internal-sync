<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center min-h-dvh',
  redirectIfLoggedIn: true,
  isAuthRequired: false,
})

const appConfig = useAppConfig()
const userStore = useUserStore()

const state = reactive<Partial<SchemaForgotPassword>>({
  email: 'admin@mail.com',
})

async function onSubmit(event: FormSubmitEvent<SchemaForgotPassword>) {
  await userStore.sendResetPasswordLink(event.data)
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
      Forgot Password
    </h1>
    <p class="text-muted text-center">
      Enter email to receive reset password link
    </p>

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
      >
        Submit
      </UButton>
    </UForm>

    <p class="text-sm text-center">
      <span class="text-muted">Remembered your password?</span>
      <NuxtLink
        to="/auth/sign-in"
        class="hover:underline"
      >
        Sign In
      </NuxtLink>
    </p>
  </div>
</template>
