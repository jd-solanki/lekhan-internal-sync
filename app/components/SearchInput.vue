<script setup lang="ts">
const refInput = useTemplateRef('refInput')

defineShortcuts({
  '/': () => {
    refInput.value?.inputRef?.focus()
  },
})
</script>

<template>
  <UInput
    ref="refInput"
    icon="i-lucide-search"
    placeholder="Search..."
  >
    <template #trailing>
      <UKbd value="/" />
    </template>
  </UInput>
</template>
