<script lang="ts" setup>
const props = withDefaults(defineProps<{
  titleTag?: string
  title: string
  subtitle?: string
}>(), {
  titleTag: 'h4',
})
</script>

<template>
  <component
    :is="props.titleTag"
    class="text-lg font-medium leading-relaxed"
  >
    {{ props.title }}
  </component>
  <p class="text-sm text-muted">
    {{ props.subtitle }}
  </p>
</template>
