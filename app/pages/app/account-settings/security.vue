<script lang="ts" setup>
const userStore = useUserStore()

async function handleDeactivate() {
  const { confirm } = useConfirm({
    title: 'Deactivate Account?',
    body: 'Your account will be deactivated immediately. All active sessions will be logged out and your content will be hidden from public pages. You can reactivate your account by signing in again.',
    confirmBtnProps: {
      label: 'Deactivate',
      color: 'error',
    },
    onConfirm: async () => {
      await userStore.deactivateCurrentAccount()
    },
  })

  await confirm()
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">
      Security
    </h2>
    <p class="text-muted">
      You can manage your security settings here.
    </p>

    <!-- Danger Zone -->
    <UCard
      :ui="{ body: 'space-y-4', root: 'ring-red-400 bg-red-100/20 dark:bg-red-100/4' }"
      class="mt-6"
    >
      <template #header>
        <h3 class="text-lg font-semibold">
          Danger Zone
        </h3>
      </template>

      <UAlert
        color="info"
        variant="subtle"
        icon="i-lucide-alert-triangle"
        title="Account Deactivation"
        description="Deactivating your account will hide your content from public pages and log you out of all sessions. You can reactivate by signing in again."
      />

      <UButton
        color="error"
        icon="i-lucide-user-x"
        variant="outline"
        @click="handleDeactivate"
      >
        Deactivate Account
      </UButton>
    </UCard>
  </div>
</template>
