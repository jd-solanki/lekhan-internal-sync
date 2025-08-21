<script lang="ts" setup>
import appConfig from '~/app.config'

definePageMeta({
  layout: 'blank',
  mainClass: 'grid place-items-center min-h-dvh',
  isEmailVerificationRequired: false,
  isAuthRequired: false,
  redirectIfEmailVerified: true,
})

const runtimeConfig = useRuntimeConfig()
const isEmailVerificationRequiredForAccess = runtimeConfig.public.shared.isEmailVerificationRequiredForAccess
const route = useRoute()
const userStore = useUserStore()

const uiState = ref(route.query.state)
const email = ref(getFirstQueryValue('email', { route }) || '')

async function sendVerificationEmail(email: string) {
  await userStore.sendVerificationEmail(email)
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
    <NuxtImg
      :src="appConfig.app.logoUrl"
      class="mx-auto size-12 my-2"
      :class="appConfig.app.logoClass"
    />
    <h1 class="font-bold text-2xl leading-10">
      {{ uiState === 'mail-sent' ? 'Verification email sent' : 'Verify your account' }}
    </h1>
    <p class="text-muted text-balance">
      {{ isEmailVerificationRequiredForAccess ? 'You need to verify your email address to proceed further' : 'Verify your email address' }}
    </p>

    <div class="mt-12 space-y-8">
      <!-- If there's no UI state => Show button to send verification email -->
      <AuthSendVerificationEmailForm
        v-if="!uiState"
        v-model:email="email"
        @submit="sendVerificationEmail"
      />

      <!-- If mail is sent => Show message -->
      <div v-else-if="uiState === 'mail-sent'">
        <p>Please check your inbox.</p>
      </div>

      <!-- Only show action buttons if there's no UI state -->
      <!-- E.g. Don't show action buttons is mail is sent -->
      <template v-if="!uiState">
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
