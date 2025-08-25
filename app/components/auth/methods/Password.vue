<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { redirectUrlSchema } from '~~/shared/schemas'

const appConfig = useAppConfig()
const userStore = useUserStore()
const route = useRoute()
const paymentsStore = usePaymentsStore()

const state = reactive<Partial<SchemaSignIn>>({
  // email: undefined,
  // password: undefined,
  email: 'admin@mail.com',
  password: 'adminadmin',
})

const querySchema = z.object({
  redirectTo: redirectUrlSchema.optional(),
  nextAction: z.string().optional(),
  productId: z.string().optional(),
})

function useParsedQuery<T extends z.ZodType>(zodSchema: T, defaults: Partial<z.infer<T>>) {
  return computed(() => {
    const parsed = zodSchema.safeParse(route.query)
    return parsed.success ? parsed.data : defaults
  })
}

const parsedQuery = useParsedQuery(querySchema, { redirectTo: undefined, nextAction: undefined })

async function onSubmit(event: FormSubmitEvent<SchemaSignIn>) {
  const nextAction = parsedQuery.value.nextAction

  await userStore.signIn(
    event.data,
    {
      redirectTo: nextAction ? false : parsedQuery.value.redirectTo,
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

const lastSignInMethod = useCookie('lastSignInMethod')
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
        :open="lastSignInMethod === 'oauth:google'"
      >
        <UButton
          variant="outline"
          icon="i-logos-google-icon"
          block
          :disabled="userStore.isLoading"
          loading-auto
          @click="userStore.socialSignIn('google')"
        >
          Google
        </UButton>
      </AuthLastSignInIndicator>

      <AuthLastSignInIndicator
        side="right"
        :open="lastSignInMethod === 'oauth:github'"
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
          <NuxtLink
            to="/auth/forgot-password"
            class="hover:underline"
          >
            Forgot Password?
          </NuxtLink>
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
        :open="lastSignInMethod === 'email'"
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
      </AuthLastSignInIndicator>
    </UForm>

    <p class="text-sm text-center">
      <span class="text-muted">Don't have an account?</span>
      <NuxtLink
        to="/auth/sign-up"
        class="hover:underline"
      >
        Sign Up
      </NuxtLink>
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
