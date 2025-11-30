<script lang="ts" setup>
import type { ButtonProps } from '@nuxt/ui'

export interface ConfirmModalProps {
  title: string
  body: string
  confirmBtnProps?: ButtonProps
  cancelBtnProps?: ButtonProps
  onConfirm: () => Promise<void | false>
}

const props = defineProps<ConfirmModalProps>()

const emit = defineEmits<{
  close: [boolean]
}>()

const { isLoading: isFnProcessing, fnWithLoading } = useWithLoading(props.onConfirm)
async function _onConfirm() {
  await fnWithLoading()

  // Emit close with true to indicate confirmation
  emit('close', true)
}
</script>

<template>
  <UModal
    :title="title"
    :close="false"
    :ui="{ content: 'divide-none', body: '!pt-0 !pb-1' }"
    :dismissible="!isFnProcessing"
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
          loading-auto
          @click="_onConfirm"
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
