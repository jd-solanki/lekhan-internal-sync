<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToggle } from '@vueuse/core'

const [isCurrentPasswordVisible, toggleCurrentPasswordVisibility] = useToggle(false)
const [isNewPasswordVisible, toggleNewPasswordVisibility] = useToggle(false)
const [isConfirmPasswordVisible, toggleConfirmPasswordVisibility] = useToggle(false)

const { errorToast, successToast } = useToastMessage()
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()

const { data: accountsData } = await useFetch('/api/me/accounts', {
  default: () => ({ accounts: [], hasEmailAccount: false }),
})

const hasEmailAccount = computed(() => accountsData.value?.hasEmailAccount || false)

const connectedOAuthProviders = computed(() => {
  const socialProviders = runtimeConfig.public.shared.auth.socialProviders
  const connectedAccounts = accountsData.value?.accounts.filter(acc => acc.isConnected) || []

  return connectedAccounts
    .map((acc) => {
      const provider = socialProviders.find(p => p.id === acc.provider)
      return provider?.name || acc.provider
    })
    .join(', ')
})

const state = reactive<SchemaChangePassword>({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const isSubmitting = ref(false)
const withLoading = createWithLoading(isSubmitting)

async function onSubmit(event: FormSubmitEvent<SchemaChangePassword>) {
  if (userStore.isUserAdmin) {
    return // Early return in demo; Read-only operations for admin users to prevent abuse of shared admin account
  }

  await withLoading(async () => {
    try {
      const { error } = await authClient.changePassword({
        currentPassword: event.data.currentPassword,
        newPassword: event.data.newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        errorToast({
          title: 'Failed to change password',
          description: error.message || 'Unable to change password. Please try again.',
        })
        return
      }

      successToast({
        title: 'Password changed',
        description: 'Your password has been changed successfully. All sessions have been revoked.',
      })

      await userStore.signOut()
    }
    catch (error: any) {
      errorToast({
        title: 'Failed to change password',
        description: error?.message || 'An unexpected error occurred.',
      })
    }
  })
}
</script>

<template>
  <UCard>
    <template #header>
      <AppCardHeader title="Change Password" />
    </template>

    <UAlert
      v-if="!hasEmailAccount"
      color="warning"
      variant="subtle"
      icon="i-lucide-alert-triangle"
      class="mb-6"
      :title="`You signed up using ${connectedOAuthProviders}`"
      description="To set a password, please sign out and reset password."
      :actions="[{
        label: 'Reset Password',
        color: 'warning',
        variant: 'outline',
        onClick: async () => {
          userStore.signOut({ redirectTo: `/auth/forgot-password?email=${userStore.user?.email}` })
        },
      }]"
    />

    <div v-if="hasEmailAccount">
      <UForm
        :schema="schemaChangePassword"
        :state="state"
        class="space-y-6 max-w-md"
        @submit="onSubmit"
      >
        <UFormField
          label="Current Password"
          name="currentPassword"
        >
          <UInput
            v-model="state.currentPassword"
            :type="isCurrentPasswordVisible ? 'text' : 'password'"
            size="xl"
            class="w-full"
            :disabled="isSubmitting"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="isCurrentPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="isCurrentPasswordVisible ? 'Hide password' : 'Show password'"
                :aria-pressed="isCurrentPasswordVisible"
                aria-controls="currentPassword"
                @click="toggleCurrentPasswordVisibility()"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField
          label="New Password"
          name="newPassword"
        >
          <UInput
            v-model="state.newPassword"
            :type="isNewPasswordVisible ? 'text' : 'password'"
            size="xl"
            class="w-full"
            :disabled="isSubmitting"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="isNewPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="isNewPasswordVisible ? 'Hide password' : 'Show password'"
                :aria-pressed="isNewPasswordVisible"
                aria-controls="newPassword"
                @click="toggleNewPasswordVisibility()"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField
          label="Confirm New Password"
          name="confirmNewPassword"
        >
          <UInput
            v-model="state.confirmNewPassword"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            size="xl"
            class="w-full"
            :disabled="isSubmitting"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="isConfirmPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="isConfirmPasswordVisible ? 'Hide password' : 'Show password'"
                :aria-pressed="isConfirmPasswordVisible"
                aria-controls="confirmNewPassword"
                @click="toggleConfirmPasswordVisibility()"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          type="submit"
          size="lg"
          :loading="isSubmitting"
          :disabled="userStore.isUserAdmin"
        >
          Change Password
        </UButton>
      </UForm>
    </div>
  </UCard>
</template>
