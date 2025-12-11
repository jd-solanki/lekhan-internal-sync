<script lang="ts" setup>
import type { SocialProviderId } from '~~/layers/auth/server/libs/auth'

definePageMeta({
  search: {
    label: 'Linked Accounts',
    icon: 'i-lucide-link',
  },
  // Render betterAuth errors via toast
  flashMessageErrorQueryAlias: 'error',
})

const { errorToast, successToast } = useToastMessage()
const runtimeConfig = useRuntimeConfig()

// Get social providers from runtimeConfig
const socialProviders = runtimeConfig.public.shared.auth.socialProviders

// Build provider config map for easy lookups
const providerConfigMap = computed(() => {
  return Object.fromEntries(
    socialProviders.map(p => [p.id, p]),
  )
})

// Fetch linked accounts
const { data: accountsData, refresh: refreshAccounts } = await useFetch('/api/me/accounts', {
  default: () => ({ accounts: [], hasEmailAccount: false }),
})

const accounts = computed(() => accountsData.value?.accounts || [])
const hasEmailAccount = computed(() => accountsData.value?.hasEmailAccount || false)

const connectedSocialAccountsCount = computed(() => {
  return accounts.value?.filter(acc => acc.isConnected).length || 0
})

async function linkAccount(provider: SocialProviderId) {
  try {
    const callbackURL = `${runtimeConfig.public.app.baseUrl}/app/account-settings/linked-accounts?flash_message__success=${encodeURIComponent('Account linked successfully')}`

    await authClient.linkSocial({
      provider,
      callbackURL,
      errorCallbackURL: `${runtimeConfig.public.app.baseUrl}/app/account-settings/linked-accounts`,
    })
  }
  catch (error: any) {
    errorToast({
      title: 'Failed to link account',
      description: error?.message || 'Unable to link account. Please try again.',
    })
  }
}

async function unlinkAccount(provider: SocialProviderId) {
  const account = accounts.value?.find(acc => acc.provider === provider)
  if (!account?.isConnected)
    return

  // Check if user can safely unlink
  const canUnlink = hasEmailAccount.value || connectedSocialAccountsCount.value > 1

  if (!canUnlink) {
    errorToast({
      title: 'Cannot unlink account',
      description: 'You must have at least one authentication method. Add an email account first.',
    })
    return
  }

  const providerName = providerConfigMap.value[provider]?.name || provider

  const { confirm } = useConfirm({
    title: `Unlink ${providerName}?`,
    body: `Are you sure you want to unlink your ${providerName} account? You can link it again later.`,
    confirmBtnProps: {
      label: 'Unlink',
      color: 'error',
    },
    onConfirm: async () => {
      try {
        const res = await authClient.unlinkAccount({
          providerId: provider,
        })

        if (res.error) {
          errorToast({
            title: 'Failed to unlink account',
            description: res.error.message || 'Unable to unlink account.',
          })
          return false
        }

        successToast({
          title: 'Account unlinked',
          description: `Your ${providerName} account has been unlinked.`,
        })

        await refreshAccounts()
      }
      catch (error: any) {
        errorToast({
          title: 'Failed to unlink account',
          description: error?.message || 'Unable to unlink account.',
        })
        return false
      }
    },
  })

  await confirm()
}

function formatDate(date: Date | null) {
  if (!date)
    return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Refresh accounts on mount (in case user just linked an account via OAuth redirect)
onMounted(async () => {
  await refreshAccounts()
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-2">
      Linked Accounts
    </h2>
    <p class="text-muted mb-6">
      Connect your social accounts to sign in with them
    </p>

    <div class="space-y-4">
      <UCard
        v-for="provider in socialProviders"
        :key="provider.id"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UIcon
              :name="provider.icon"
              :class="provider.iconClass"
              class="size-10"
            />
            <div>
              <h3 class="font-semibold">
                {{ provider.name }}
              </h3>
              <p
                v-if="accounts?.find(acc => acc.provider === provider.id)?.isConnected"
                class="text-sm text-muted"
              >
                Connected {{ formatDate(accounts?.find(acc => acc.provider === provider.id)?.createdAt || null) }}
              </p>
              <p
                v-else
                class="text-sm text-muted"
              >
                Not connected
              </p>
            </div>
          </div>

          <div>
            <UButton
              v-if="accounts?.find(acc => acc.provider === provider.id)?.isConnected"
              color="error"
              variant="outline"
              icon="i-lucide-unlink"
              loading-auto
              @click="unlinkAccount(provider.id)"
            >
              Unlink
            </UButton>

            <!-- INFO: `light:invert` is added to handle light/dark for github icon on solid button -->
            <UButton
              v-else
              color="neutral"
              :icon="provider.icon"
              :ui="provider.iconClass ? { leadingIcon: 'light:invert' } : undefined"
              loading-auto
              @click="linkAccount(provider.id)"
            >
              Connect
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
