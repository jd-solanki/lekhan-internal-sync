<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type { SocialProviderId } from '~~/server/libs/auth'
import type { SchemaChangePassword } from '~~/shared/schemas/auth'
import { schemaChangePassword } from '~~/shared/schemas/auth'
import { authClient } from '~/libs/auth'

const { errorToast, successToast } = useToastMessage()
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()

const { data: accountsData } = await useFetch<{
  accounts: Array<{
    provider: SocialProviderId
    isConnected: boolean
    accountId: string | null
    createdAt: Date | null
  }>
  hasEmailAccount: boolean
}>('/api/accounts', {
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
      <h4 class="text-lg font-semibold">
        Change Password
      </h4>
    </template>

    <UAlert
      v-if="!hasEmailAccount"
      color="warning"
      variant="subtle"
      icon="i-lucide-alert-triangle"
      class="mb-6"
      :title="`You signed up using ${connectedOAuthProviders}`"
      description="To set a password, please use the forgot password flow first."
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
            type="password"
            size="xl"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>

        <UFormField
          label="New Password"
          name="newPassword"
        >
          <UInput
            v-model="state.newPassword"
            type="password"
            size="xl"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>

        <UFormField
          label="Confirm New Password"
          name="confirmNewPassword"
        >
          <UInput
            v-model="state.confirmNewPassword"
            type="password"
            size="xl"
            class="w-full"
            :disabled="isSubmitting"
          />
        </UFormField>

        <UButton
          type="submit"
          size="lg"
          :loading="isSubmitting"
        >
          Change Password
        </UButton>
      </UForm>
    </div>
  </UCard>
</template>
