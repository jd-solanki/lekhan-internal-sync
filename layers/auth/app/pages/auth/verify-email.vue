<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center',
  isEmailVerificationRequired: false,
  isAuthRequired: false,
  redirectIfEmailVerified: true,
})

const runtimeConfig = useRuntimeConfig()
const isEmailVerificationRequiredForAccess = runtimeConfig.public.shared.isEmailVerificationRequiredForAccess
const route = useRoute()
const userStore = useUserStore()

const schema = z.object({
  email: z.email({ error: e => !e.input ? 'Email is required' : 'Invalid email address' }).lowercase(),
})

const uiState = ref(route.query.state)
const email = ref(getFirstQueryValue('email', { route }) || '')

async function sendVerificationEmail(event: FormSubmitEvent<z.infer<typeof schema>>) {
  await userStore.sendVerificationEmail(event.data.email)
    .then(() => {
      uiState.value = 'mail-sent'
    })
    .catch(() => {
      uiState.value = undefined
    })
}
</script>

<template>
  <div class="text-center w-80">
    <AppLogo class="mx-auto size-12 my-2" />
    <h1 class="font-bold text-2xl leading-10">
      {{ uiState === 'mail-sent' ? 'Verification email sent' : 'Verify your account' }}
    </h1>
    <p class="text-muted text-balance">
      {{ isEmailVerificationRequiredForAccess ? 'You need to verify your email address to proceed further' : 'Verify your email address' }}
    </p>

    <div class="mt-12 space-y-8">
      <!-- If mail is sent => Show message -->
      <div v-if="uiState === 'mail-sent'">
        <p>Please check your inbox.</p>
      </div>

      <template v-if="!uiState">
        <!-- If there's no UI state => Show button to send verification email -->
        <UForm
          :schema="schema"
          :state="{ email }"
          class="space-y-4 text-left"
          @submit="sendVerificationEmail"
        >
          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="email"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            block
            class="mx-auto"
            :disabled="userStore.isLoading"
            loading-auto
          >
            Send Verification Mail
          </UButton>
        </UForm>

        <!-- Only show action buttons if there's no UI state -->
        <!-- E.g. Don't show action buttons is mail is sent -->
        <!-- Action Buttons -->
        <UButton
          v-if="isEmailVerificationRequiredForAccess"
          variant="ghost"
          :to="runtimeConfig.public.app.routes.signIn"
        >
          Log in with different account
        </UButton>
        <UButton
          v-else
          to="/"
          variant="ghost"
        >
          Go to Home
        </UButton>
      </template>
    </div>
  </div>
</template>
