<script lang="ts" setup>
defineProps<{
  side: 'left' | 'right'
  open: boolean
}>()
</script>

<template>
  <UPopover
    :open
    :ui="{ content: 'ring-0 shadow-none' }"
    :content="{ side, align: 'end', alignOffset: -20, sideOffset: 50 }"
  >
    <slot />
    <template #content>
      <template v-if="side === 'right'">
        <UIcon
          name="arrows:2"
          :size="100"
          class="text-muted opacity-50 rotate-35"
        />
        <span
          class="text-muted kalam-bold relative"
          style="top: -90px;"
        >Last Sign In Method</span>
      </template>
      <template v-else-if="side === 'left'">
        <span
          class="text-muted kalam-bold relative"
          style="top: -90px;"
        >Last Sign In Method</span>
        <UIcon
          name="arrows:2"
          :size="100"
          class="text-muted opacity-50 -scale-x-100 -rotate-35"
        />
      </template>
    </template>
  </UPopover>
</template>
