<script setup lang="ts">
definePageMeta({
  search: {
    label: 'Library',
    icon: 'i-lucide-home',
  },
})

const notesStore = useNotesStore()

// Populate store on mount; sortedNotes computed reacts to store state
const { pending } = await useAsyncData('library-notes', () => notesStore.fetchNotes())

async function handleDeleteNote(id: number) {
  await notesStore.deleteNote(id)
}
</script>

<template>
  <div>
    <AppPageHeader title="Library" />

    <!-- Loading skeletons -->
    <div
      v-if="pending"
      class="p-4"
    >
      <p class="flex items-center gap-1.5 text-sm text-muted mb-3">
        <UIcon
          name="i-lucide-clock"
          class="size-4"
        />
        Recently Edited
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <USkeleton
          v-for="n in 4"
          :key="n"
          class="h-32 rounded-lg"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="notesStore.sortedNotes.length === 0"
      class="max-w-lg"
    >
      <UEmpty
        icon="i-lucide-notebook"
        title="No notes yet"
        description="It looks like you haven't added any notes. Create one to get started."
        :actions="[
          {
            icon: 'i-lucide-plus',
            label: 'Create new',
            onClick: async () => { await notesStore.createEmptyNoteAndNavigate() },
          },
        ]"
      />
    </div>

    <!-- Notes grid -->
    <div
      v-else
      class="p-4"
    >
      <p class="flex items-center gap-1.5 text-sm text-muted mb-3">
        <UIcon
          name="i-lucide-clock"
          class="size-4"
        />
        Recently Edited
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NoteCard
          v-for="note in notesStore.sortedNotes"
          :key="note.id"
          :note="note"
          @delete="handleDeleteNote"
        />
      </div>
    </div>
  </div>
</template>
