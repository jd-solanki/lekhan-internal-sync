<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()
const notesStore = useNotesStore()
const { isAdminRoute } = useAdmin()
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <ULink
      :to="userStore.userHomeRoute"
      class="flex gap-3 items-center text-highlighted"
    >
      <AppLogo class="size-6" />
      <h1 class="font-bold">
        {{ runtimeConfig.public.app.name }}
      </h1>
    </ULink>

    <UButton
      v-if="!isAdminRoute"
      icon="i-lucide-plus"
      color="neutral"
      variant="ghost"
      size="sm"
      loading-auto
      @click="async () => { await notesStore.createEmptyNoteAndNavigate() }"
    />
  </div>
</template>
