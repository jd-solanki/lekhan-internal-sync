<script setup lang="ts">
import * as z from 'zod'

const emit = defineEmits<{
  (e: 'submit', email: string): void
}>()

const email = defineModel('email', { type: String, default: '' })
const schema = z.object({
  email: z.email({ error: e => !e.input ? 'Email is required' : 'Invalid email address' }).lowercase(),
})
</script>

<template>
  <UForm
    :schema="schema"
    :state="{ email }"
    class="space-y-4 text-left"
    @submit="emit('submit', email)"
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
    >
      Send Verification Mail
    </UButton>
  </UForm>
</template>
