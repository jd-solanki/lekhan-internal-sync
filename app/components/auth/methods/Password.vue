<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import * as z from 'zod'
import { redirectUrlSchema } from '~~/shared/schemas'

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')

const appConfig = useAppConfig()
const userStore = useUserStore()
const route = useRoute()
const paymentsStore = usePaymentsStore()

const state = reactive<Partial<SchemaSignIn>>({
  email: process.env.NODE_ENV === 'development' ? 'admin@mail.com' : undefined,
  password: process.env.NODE_ENV === 'development' ? 'adminadmin' : undefined,
})

const parsedQuery = useParsedQuery(
  z.object({
    redirectUrl: redirectUrlSchema.optional(),
    nextAction: z.string().optional(),
    productId: z.string().optional(),
  }),
  {},
  { route },
)

async function onSubmit(event: FormSubmitEvent<SchemaSignIn>) {
  const nextAction = parsedQuery.value.nextAction

  await userStore.signIn(
    event.data,
    {
      redirectUrl: nextAction ? false : parsedQuery.value.redirectUrl,
      onSuccess: async () => {
        // If nextAction is checkout & productId is present create checkout session
        if (nextAction) {
          const productId = parsedQuery.value.productId
          if (nextAction === 'checkout' && productId) {
            await paymentsStore.createCheckoutSession(productId)
          }
        }
      },
    },
  )
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
      Sign in to continue with {{ appConfig.app.title }}
    </p>

    <div class="flex items-center gap-4 my-10">
      <AuthLastSignInIndicator
        side="left"
        :open="largerThanLg && lastSignInMethod === 'google'"
      >
        <UChip
          text="Last Used"
          :show="!largerThanLg && lastSignInMethod === 'google'"
          size="3xl"
          :ui="{ base: 'px-2 py-3', root: 'grow' }"
          position="top-left"
        >
          <UButton
            variant="outline"
            icon="i-logos-google-icon"
            block
            :disabled="userStore.isLoading"
            loading-auto
            class="w-full"
            @click="userStore.socialSignIn('google')"
          >
            Google
          </UButton>
        </UChip>
      </AuthLastSignInIndicator>

      <AuthLastSignInIndicator
        side="right"
        :open="largerThanLg && lastSignInMethod === 'github'"
      >
        <UChip
          text="Last Used"
          :show="!largerThanLg && lastSignInMethod === 'github'"
          size="3xl"
          :ui="{ base: 'px-2 py-3', root: 'grow' }"
        >
          <UButton
            :ui="{ leadingIcon: 'dark:invert' }"
            variant="outline"
            icon="i-logos-github-icon"
            block
            :disabled="userStore.isLoading"
            loading-auto
            @click="userStore.socialSignIn('github')"
          >
            GitHub
          </UButton>
        </UChip>
      </AuthLastSignInIndicator>
    </div>

    <USeparator label="Or continue With" />

    <UForm
      :schema="schemaSignIn"
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
          placeholder="john@mail.com"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Password"
        name="password"
      >
        <template #hint>
          <ULink
            to="/auth/forgot-password"
            class="hover:underline"
          >
            Forgot Password?
          </ULink>
        </template>
        <UInput
          v-model="state.password"
          type="password"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <AuthLastSignInIndicator
        side="right"
        :open="largerThanLg && lastSignInMethod === 'email'"
      >
        <UChip
          text="Last Used"
          :show="!largerThanLg && lastSignInMethod === 'email'"
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
            Sign In
          </UButton>
        </UChip>
      </AuthLastSignInIndicator>
    </UForm>

    <p class="text-sm text-center">
      <span class="text-muted">Don't have an account?</span>
      <ULink
        to="/auth/sign-up"
        class="hover:underline"
      >
        Sign Up
      </ULink>
    </p>
  </div>
</template>

<style>
.kalam-light {
  font-family: "Kalam", cursive;
  font-weight: 300;
  font-style: normal;
}

.kalam-regular {
  font-family: "Kalam", cursive;
  font-weight: 400;
  font-style: normal;
}

.kalam-bold {
  font-family: "Kalam", cursive;
  font-weight: 700;
  font-style: normal;
}
</style>
