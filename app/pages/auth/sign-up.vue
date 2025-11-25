<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToggle } from '@vueuse/core'

const [isPasswordVisible, togglePasswordVisibility] = useToggle(false)

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  redirectIfSignedIn: true,
  isAuthRequired: false,
})

const userStore = useUserStore()
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const socialProviders = runtimeConfig.public.shared.auth.socialProviders

const state = reactive<SchemaSignUp>({
  email: process.env.NODE_ENV === 'development' ? 'admin@mail.com' : '',
  password: process.env.NODE_ENV === 'development' ? 'adminadmin' : '',
})

async function onSubmit(event: FormSubmitEvent<SchemaSignUp>) {
  await userStore.signUp(event.data)
}

const lastSignInMethod = authClient.getLastUsedLoginMethod()
</script>

<template>
  <div class="w-80">
    <NuxtImg
      :src="appConfig.app.logoUrl"
      class="mx-auto size-12 my-2"
      :class="appConfig.app.logoClass"
    />
    <h1 class="font-bold text-2xl leading-10 text-center">
      Create an account
    </h1>
    <p class="text-muted text-center">
      Sign up to start with {{ runtimeConfig.public.app.name }}
    </p>

    <div class="flex items-center gap-4 my-10">
      <UButton
        v-for="provider in socialProviders"
        :key="provider.id"
        :ui="provider.iconClass ? { leadingIcon: provider.iconClass } : undefined"
        variant="outline"
        :icon="provider.icon"
        block
        :disabled="userStore.isLoading"
        loading-auto
        @click="userStore.socialSignIn(provider.id)"
      >
        {{ provider.name }}
      </UButton>
    </div>

    <USeparator label="Or continue With" />

    <UForm
      :schema="schemaSignUp"
      :state="state"
      class="space-y-6 my-8"
      @submit="onSubmit"
    >
      <UFormField
        label="Email"
        name="email"
      >
        <UInput
          v-model="state.email"
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
        size="lg"
        block
        :loading="userStore.isLoading"
      >
        Sign Up
      </UButton>
    </UForm>

    <UAlert
      v-if="lastSignInMethod"
      color="info"
      variant="subtle"
      title="Welcome back!"
      description="Looks like you've used our site before. Try signing in instead."
      :ui="{ description: 'mt-1' }"
    >
      <template #actions>
        <UButton
          to="/auth/sign-in"
          size="sm"
        >
          Sign In
        </UButton>
      </template>
    </UAlert>
    <p
      v-else
      class="text-sm text-center"
    >
      <span class="text-muted">Already have an account?</span>
      <ULink
        to="/auth/sign-in"
        class="hover:underline"
      >
        Sign In
      </ULink>
    </p>
  </div>
</template>
