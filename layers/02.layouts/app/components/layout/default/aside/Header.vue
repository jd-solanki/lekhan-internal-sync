<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
const userStore = useUserStore()
const notesStore = useNotesStore()
const { errorToast } = useToastMessage()

async function handleCreateNote() {
  try {
    const newNote = await notesStore.createNote({ title: 'Untitled', content: '' })
    await navigateTo(`/app/notes/${newNote.id}`)
  }
  catch {
    errorToast({
      title: 'Failed to create note',
      description: 'An error occurred while creating the note.',
    })
  }
}
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
      icon="i-lucide-plus"
      color="neutral"
      variant="ghost"
      size="sm"
      loading-auto
      @click="handleCreateNote"
    />
  </div>
</template>
