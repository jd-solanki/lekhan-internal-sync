<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { breakpointsTailwind, useBreakpoints, useMounted, useToggle } from '@vueuse/core'
import * as z from 'zod'
import { redirectUrlSchema } from '~~/shared/schemas'

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const isMounted = useMounted()

const [isPasswordVisible, togglePasswordVisibility] = useToggle(false)

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
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
const socialProviders = runtimeConfig.public.shared.auth.socialProviders
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
      <AuthLastSignInIndicator
        side="right"
        :open="largerThanLg && lastSignInMethod === 'email'"
      >
        <UChip
          text="Last Used"
          :show="isMounted && !largerThanLg && lastSignInMethod === 'email'"
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
