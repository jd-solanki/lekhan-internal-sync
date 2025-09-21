<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'

const emit = defineEmits<{
  close: [boolean]
}>()

const schema = schemaSignUpWithName
type Schema = z.output<typeof schema>
const { errorToast } = useToastMessage()

const state = reactive<Partial<Schema>>({
  email: undefined,
  name: undefined,
  password: undefined,
})

async function _onSubmit(event: FormSubmitEvent<Schema>) {
  const { data, error } = await authClient.admin.createUser({
    ...event.data,
    role: 'user',
    data: { customField: 'customValue' },
  })

  if (error || !data) {
    errorToast({ title: 'Error', description: error?.message || 'Failed to create user' })
  }

  emit('close', !!data)
}
const { isLoading, fnWithLoading: onSubmit } = useWithLoading(_onSubmit)

const uniqueId = useId()
</script>

<template>
  <UModal
    title="Create User"
    :close="{ onClick: () => $emit('close', false) }"
    :ui="{ content: 'divide-none', body: '!pt-0 !pb-1' }"
  >
    <template #body>
      <UForm
        :id="uniqueId"
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField
          label="Name"
          name="name"
        >
          <UInput
            v-model="state.name"
            autofocus
            size="xl"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            size="xl"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            size="xl"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        type="submit"
        size="lg"
        :form="uniqueId"
        block
        :loading="isLoading"
      >
        Add User
      </UButton>
    </template>
  </UModal>
</template>
