import type { InternalApi } from 'nitropack/types'

type NoteListItem = InternalApi['/api/notes']['get']['data'][number]

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<NoteListItem[]>([])

  const { errorToast } = useToastMessage()

  // Computed
  const noteCount = computed(() => notes.value.length)
  const sortedNotes = computed(() => [...notes.value].sort((a, b) => a.position - b.position))

  // Actions
  async function fetchNotes() {
    const response = await $fetch('/api/notes')
    notes.value = response.data
    return response.data
  }

  async function createNote(data: { title: string, content: string }) {
    const newNote = await $fetch('/api/notes', {
      method: 'POST',
      body: data,
    })

    // Prepend to list (metadata only)
    notes.value.unshift({
      id: newNote.id,
      title: newNote.title,
      position: newNote.position,
      createdAt: newNote.createdAt,
      updatedAt: newNote.updatedAt,
    })

    return newNote
  }

  async function createEmptyNoteAndNavigate() {
    try {
      const newNote = await createNote({ title: 'Untitled', content: '' })
      await navigateTo(`/app/notes/${newNote.id}`)

      return newNote
    }
    catch {
      errorToast({
        title: 'Failed to create note',
        description: 'An error occurred while creating the note.',
      })
    }
  }

  async function updateNote(id: number, data: { title?: string, content?: string }) {
    const updated = await $fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      body: data,
    })

    // Update list item
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      const existing = notes.value[index]!
      notes.value[index] = {
        id: existing.id,
        position: existing.position,
        createdAt: existing.createdAt,
        title: updated.title,
        updatedAt: updated.updatedAt,
      }
    }

    return updated
  }

  async function deleteNote(id: number) {
    await $fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    })

    notes.value = notes.value.filter(note => note.id !== id)
  }

  return {
    notes,
    noteCount,
    sortedNotes,
    fetchNotes,
    createNote,
    createEmptyNoteAndNavigate,
    updateNote,
    deleteNote,
  }
})
