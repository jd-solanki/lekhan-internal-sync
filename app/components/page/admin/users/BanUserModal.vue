<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const emit = defineEmits<{
  close: [false | Schema]
}>()

const schema = z.object({
  banReason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
  banExpiresIn: z.preprocess(
    (val) => {
      if (typeof val === 'number') {
        const banInSeconds = val * 60 * 60 * 24 // days to seconds

        return banInSeconds > 0 ? banInSeconds : undefined
      }
    },
    z.number().positive().optional(),
  ),
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  banReason: '',
  banExpiresIn: 0,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('close', event.data)
}
</script>

<template>
  <UModal
    title="Ban User"
    :close="{ onClick: () => $emit('close', false) }"
    :ui="{ content: 'divide-none', body: '!pt-0 !pb-1' }"
  >
    <template #body>
      <UForm
        id="ban-user-form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Reason"
          name="banReason"
        >
          <UTextarea
            v-model="state.banReason"
            class="w-full"
            placeholder="Reason for banning this user"
          />
        </UFormField>

        <UFormField
          label="Ban Expires In"
          name="banExpiresIn"
          help="0 means permanent ban"
        >
          <UFieldGroup>
            <UInputNumber
              v-model="state.banExpiresIn"
              :min="0"
              class="w-32"
            />
            <UBadge
              color="neutral"
              variant="outline"
              size="lg"
              label="Days"
            />
          </UFieldGroup>
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <div class="flex gap-2">
        <UButton
          label="Ban User"
          color="error"
          type="submit"
          form="ban-user-form"
        />
        <UButton
          label="Cancel"
          variant="ghost"
          @click="close"
        />
      </div>
    </template>
  </UModal>
</template>
