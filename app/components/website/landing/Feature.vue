<script setup lang="ts">
defineProps<{
  title: string
  features: { icon: string, label: string, badge?: string }[]
}>()
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-16 items-center justify-center">
    <!-- Feature Details -->
    <div class="flex-1 flex flex-col gap-10 w-full">
      <!-- Header -->
      <div class="flex flex-col gap-4">
        <h3 class="font-['Kalam'] font-bold text-4xl text-highlighted">
          {{ title }}
        </h3>
        <p class="text-base text-muted leading-6">
          <slot name="description" />
        </p>
      </div>

      <!-- Feature List -->
      <div class="space-y-6">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex gap-3 items-center"
        >
          <UIcon
            :name="feature.icon"
            class="size-6 shrink-0"
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

    <!-- Feature Image -->
    <div class="flex-1 w-full min-h-[370px] ring-muted/50 ring-8 rounded-lg">
      <div class="w-full h-[370px] rounded-[calc(var(--ui-radius)*2)] overflow-hidden">
        <img
          src="/images/landing/auth-feature.png"
          alt="Authentication dashboard preview"
          class="w-full h-full object-cover object-top-left"
        >
      </div>
    </div>
  </div>
</template>
