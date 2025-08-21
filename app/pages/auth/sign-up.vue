<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center min-h-dvh',
  redirectIfLoggedIn: true,
  isAuthRequired: false,
})

const userStore = useUserStore()
const appConfig = useAppConfig()

const state = reactive<SchemaSignUp>({
  email: 'admin@mail.com',
  password: 'adminadmin',
  name: 'John Doe',
})

async function onSubmit(event: FormSubmitEvent<SchemaSignUp>) {
  await userStore.signUp(event.data)
}
</script>

<template>
  <div class="text-center w-80">
    <NuxtImg
      :src="appConfig.app.logoUrl"
      class="mx-auto size-12 my-2"
      :class="appConfig.app.logoClass"
    />
    <h1 class="font-bold text-2xl leading-10">
      Create an account
    </h1>
    <p class="text-muted">
      Sign up to start with {{ appConfig.app.title }}
    </p>

    <UForm
      :schema="schemaSignUp"
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
        size="lg"
        block
      >
        Sign Up
      </UButton>
    </UForm>

    <p class="text-sm">
      <span class="text-muted">Already have an account?</span>
      <NuxtLink
        to="/auth/sign-in"
        class="hover:underline"
      >
        Sign In
      </NuxtLink>
    </p>
  </div>
</template>
