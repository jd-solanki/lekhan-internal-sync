<script setup lang="ts">
import type { AsyncDataRequestStatus } from 'nuxt/app'

const props = defineProps<{
  label: string
  state: AsyncDataRequestStatus
}>()

const emit = defineEmits<{
  retry: []
}>()

const icon = computed(() => {
  switch (props.state) {
    case 'success':
      return 'i-lucide-check'
    case 'error':
      return 'i-lucide-circle-x'
    default:
      return 'i-lucide-loader-2'
  }
})

const color = computed(() => {
  switch (props.state) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    default:
      return 'neutral'
  }
})

const isRetryVisible = computed(() => props.state === 'error')

// Treat idle as loading for the pre-exec state.
const isLoading = computed(() => props.state === 'pending' || props.state === 'idle')
</script>

<template>
  <UAlert
    :icon="icon"
    :title="label"
    class="py-3 border-none ring-transparent justify-self-center w-auto"
    variant="outline"
    :color="color"
    :ui="{ icon: isLoading ? 'animate-spin' : '' }"
    :actions="[
      ...(isRetryVisible ? [{
        icon: 'i-lucide-refresh-cw',
        label: 'Retry',
        onClick: () => emit('retry'),
      }] : []),
    ]"
  />
</template>
