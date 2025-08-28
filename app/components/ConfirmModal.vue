<script lang="ts" setup>
defineProps<{
  title: string
  body: string
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
          label="Confirm"
          color="error"
          @click="$emit('close', true)"
        />
        <UButton
          color="neutral"
          label="Cancel"
          variant="ghost"
          @click="$emit('close', false)"
        />
      </div>
    </template>
  </UModal>
</template>
