<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  feedback: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  feedback: undefined,
})

const { successToast } = useToastMessage()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  successToast({ title: 'Success', description: 'The form has been submitted.' })
  // eslint-disable-next-line no-console
  console.log(event.data)
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Feedback"
      name="feedback"
    >
      <UInput v-model="state.feedback" />
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
