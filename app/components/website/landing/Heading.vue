<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <h3 class="font-['Kalam'] font-bold text-4xl text-highlighted mb-8">
    {{ title }}
  </h3>
</template>
