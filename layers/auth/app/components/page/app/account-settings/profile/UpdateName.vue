<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'

const { errorToast, successToast } = useToastMessage()
const userStore = useUserStore()

const state = reactive<SchemaUpdateProfile>({
  name: userStore.user?.name || '',
})

const isSubmitting = ref(false)
const withLoading = createWithLoading(isSubmitting)

async function onSubmit(event: FormSubmitEvent<SchemaUpdateProfile>) {
  await withLoading(async () => {
    try {
      const { error } = await authClient.updateUser({
        name: event.data.name,
      })

      if (error) {
        errorToast({
          title: 'Failed to update name',
          description: error.message || 'Unable to update name. Please try again.',
        })
        return
      }

      await userStore.refetchUserSessionData()

      successToast({
        title: 'Name updated',
        description: 'Your name has been updated successfully.',
      })
    }
    catch (error: any) {
      errorToast({
        title: 'Failed to update name',
        description: error?.message || 'An unexpected error occurred.',
      })
    }
  })
}
</script>

<template>
  <div>
    <UForm
      :schema="schemaUpdateProfile"
      :state="state"
      class="space-y-6 max-w-xs"
      @submit="onSubmit"
    >
      <UFormField
        label="Name"
        name="name"
      >
        <UInput
          v-model="state.name"
          type="text"
          size="xl"
          class="w-full"
          :disabled="isSubmitting"
        />
      </UFormField>

      <UButton
        type="submit"
        size="lg"
        :loading="isSubmitting"
        :disabled="userStore.user?.name === state.name"
      >
        Update Name
      </UButton>
    </UForm>
  </div>
</template>
