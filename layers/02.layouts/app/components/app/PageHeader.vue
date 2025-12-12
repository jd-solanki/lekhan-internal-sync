<script lang="ts" setup>
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-wrap gap-6 items-center mb-6">
    <div class="space-y-1">
      <h1 class="text-xl font-bold">
        {{ title }}
      </h1>
      <p v-if="description">
        {{ description }}
      </p>
    </div>

    <div class="grow" />

    <slot name="actions" />
  </div>
</template>
