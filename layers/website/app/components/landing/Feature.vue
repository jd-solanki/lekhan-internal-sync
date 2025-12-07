<script setup lang="ts">
defineProps<{
  title: string
  features: { icon: string, label: string, badge?: string }[]
}>()
</script>

<template>
  <div class="flex flex-col gap-10 w-full">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <h3 class="font-['Kalam'] font-bold text-4xl text-highlighted">
        {{ title }}
      </h3>
      <p
        v-if="$slots.description"
        class="text-base text-muted leading-6"
      >
        <slot name="description" />
      </p>
    </div>

    <!-- Feature List -->
    <div class="space-y-6">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="flex gap-3 items-start"
      >
        <UIcon
          :name="feature.icon"
          class="size-6 shrink-0 h-lh"
        />
        <p class="font-medium">
          {{ feature.label }}
        </p>
        <UBadge
          v-if="feature.badge"
          :label="feature.badge"
          color="info"
          variant="subtle"
          size="xs"
        />
      </div>
    </div>
  </div>
</template>
