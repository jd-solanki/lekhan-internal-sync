<script setup lang="ts">
const { data: countries, status } = await useLazyFetch('/api/countries.json')

const country = defineModel<string | undefined>()
const selectedCountryEmoji = computed(() => {
  if (!countries.value)
    return null

  return countries.value.find(c => c.code === country.value)?.emoji || null
})
</script>

<template>
  <USelectMenu
    v-model="country"
    :items="countries"
    :loading="status === 'pending'"
    label-key="name"
    :search-input="{ icon: 'i-lucide-search' }"
    value-key="code"
    placeholder="Select country"
  >
    <template #leading="{ ui }">
      <span
        v-if="selectedCountryEmoji"
        class="size-5 text-center"
      >
        {{ selectedCountryEmoji }}
      </span>
      <UIcon
        v-else
        :name="status === 'pending' ? 'i-lucide-loader-circle' : 'i-lucide-earth'"
        :class="ui.leadingIcon()"
      />
    </template>
    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ item.emoji }}
      </span>
    </template>
  </USelectMenu>
</template>
