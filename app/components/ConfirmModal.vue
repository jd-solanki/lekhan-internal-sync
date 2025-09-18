<script lang="ts" setup>
import type { ButtonProps } from '@nuxt/ui'

defineProps<{
  title: string
  body: string
  confirmBtnProps?: ButtonProps
  cancelBtnProps?: ButtonProps
}>()

defineEmits<{
  close: [boolean]
}>()
</script>

<template>
  <UModal
    :title="title"
    :close="{ onClick: () => $emit('close', false) }"
    :ui="{ content: 'divide-none', body: '!pt-0 !pb-1' }"
  >
    <template #body>
      <p>{{ body }}</p>
    </template>
    <template #footer>
      <div class="flex gap-2">
        <UButton
          v-bind="confirmBtnProps"
          :label="confirmBtnProps?.label || 'Confirm'"
          :color="confirmBtnProps?.color || 'error'"
          @click="$emit('close', true)"
        />
        <UButton
          v-bind="cancelBtnProps"
          :label="cancelBtnProps?.label || 'Cancel'"
          :color="cancelBtnProps?.color || 'neutral'"
          :variant="cancelBtnProps?.variant || 'ghost'"
          @click="$emit('close', false)"
        />
      </div>
    </template>
  </UModal>
</template>
