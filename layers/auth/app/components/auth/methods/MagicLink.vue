<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { breakpointsTailwind, useBreakpoints, useMounted } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const isMounted = useMounted()

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
      Sign in to your account
    </h1>
    <p class="text-muted text-center">
      Sign in to continue with {{ runtimeConfig.public.app.name }}
    </p>

    <div class="flex items-center gap-4 my-10">
      <AuthLastSignInIndicator
        v-for="(provider, index) in socialProviders"
        :key="provider.id"
        :side="index === 0 ? 'left' : 'right'"
        :open="largerThanLg && lastSignInMethod === provider.id"
      >
        <UChip
          text="Last Used"
          :show="isMounted && !largerThanLg && lastSignInMethod === provider.id"
          size="3xl"
          :ui="{ base: 'px-2 py-3', root: 'grow' }"
          :position="index === 0 ? 'top-left' : undefined"
        >
          <UButton
            :ui="provider.iconClass ? { leadingIcon: provider.iconClass } : undefined"
            variant="outline"
            :icon="provider.icon"
            color="neutral"
            block
            :disabled="userStore.isLoading"
            loading-auto
            class="w-full"
            @click="userStore.socialSignIn(provider.id)"
          >
            {{ provider.name }}
          </UButton>
        </UChip>
      </AuthLastSignInIndicator>
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
        help="Sign in link will be sent to this email"
      >
        <UInput
          v-model="state.email"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <AuthLastSignInIndicator
        side="right"
        :open="largerThanLg && lastSignInMethod === 'magiclink'"
      >
        <UChip
          text="Last Used"
          :show="isMounted && !largerThanLg && lastSignInMethod === 'magiclink'"
          size="3xl"
          :ui="{ base: 'px-2 py-3', root: 'w-full' }"
        >
          <UButton
            type="submit"
            block
            size="lg"
            :disabled="userStore.isLoading"
            loading-auto
          >
            Continue with Email
          </UButton>
        </UChip>
      </AuthLastSignInIndicator>
    </UForm>
  </div>
</template>
