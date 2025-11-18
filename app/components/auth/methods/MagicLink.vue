<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()

const socialProviders = runtimeConfig.public.shared.auth.socialProviders

const state = reactive<SchemaMagicLink>({
  email: process.env.NODE_ENV === 'development' ? 'admin@mail.com' : '',
})

async function onSubmit(event: FormSubmitEvent<SchemaMagicLink>) {
  await userStore.sendMagicLink(event.data.email)
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
      Sign in to your account
    </h1>
    <p class="text-muted text-center">
      Sign in to continue with {{ runtimeConfig.public.app.name }}
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
      :schema="schemaMagicLink"
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
        Send Magic Link
      </UButton>
    </UForm>
  </div>
</template>
