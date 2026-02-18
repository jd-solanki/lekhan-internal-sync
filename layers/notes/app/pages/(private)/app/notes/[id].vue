<script setup lang="ts">
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { useDebounceFn, useEventListener, useTimeAgo } from '@vueuse/core'

definePageMeta({
  search: {
    label: 'Note Editor',
    icon: 'i-lucide-notebook-pen',
  },
})

// Bubble toolbar — appears on text selection for inline formatting
const bubbleItems: EditorToolbarItem[][] = [
  [{
    kind: 'mark',
    mark: 'bold',
    icon: 'i-lucide-bold',
    tooltip: { text: 'Bold' },
  }, {
    kind: 'mark',
    mark: 'italic',
    icon: 'i-lucide-italic',
    tooltip: { text: 'Italic' },
  }, {
    kind: 'mark',
    mark: 'strike',
    icon: 'i-lucide-strikethrough',
    tooltip: { text: 'Strikethrough' },
  }, {
    kind: 'mark',
    mark: 'code',
    icon: 'i-lucide-code',
    tooltip: { text: 'Code' },
  }, {
    kind: 'link',
    icon: 'i-lucide-link',
    tooltip: { text: 'Link' },
  }],
]

// Slash command menu — type "/" to open
const slashItems: EditorSuggestionMenuItem[][] = [
  [{
    type: 'label',
    label: 'Text',
  }, {
    kind: 'paragraph',
    label: 'Paragraph',
    icon: 'i-lucide-type',
  }, {
    kind: 'heading',
    level: 1,
    label: 'Heading 1',
    icon: 'i-lucide-heading-1',
  }, {
    kind: 'heading',
    level: 2,
    label: 'Heading 2',
    icon: 'i-lucide-heading-2',
  }, {
    kind: 'heading',
    level: 3,
    label: 'Heading 3',
    icon: 'i-lucide-heading-3',
  }],
  [{
    type: 'label',
    label: 'Lists',
  }, {
    kind: 'bulletList',
    label: 'Bullet List',
    icon: 'i-lucide-list',
  }, {
    kind: 'orderedList',
    label: 'Numbered List',
    icon: 'i-lucide-list-ordered',
  }],
  [{
    type: 'label',
    label: 'Insert',
  }, {
    kind: 'blockquote',
    label: 'Blockquote',
    icon: 'i-lucide-text-quote',
  }, {
    kind: 'codeBlock',
    label: 'Code Block',
    icon: 'i-lucide-square-code',
  }, {
    kind: 'horizontalRule',
    label: 'Divider',
    icon: 'i-lucide-separator-horizontal',
  }],
]

const route = useRoute()
const notesStore = useNotesStore()
const { errorToast } = useToastMessage()

const noteId = computed(() => Number((route.params as { id: string }).id))
const title = ref('')
const content = ref('')

const breadcrumbItems = computed(() => [
  {
    label: 'Notes',
    to: '/app',
  },
  {
    label: title.value || 'Untitled',
  },
])

// Track the initial snapshot to detect real changes (avoids false-dirty on first load)
const savedTitle = ref('')
const savedContent = ref('')

// Initialized after useAsyncData resolves; updated after each successful save
const updatedAt = ref<string | Date | null>(null)

const { isLoading: isSaving, fnWithLoading: saveNote } = useWithLoading(
  async () => {
    // Use route-scoped noteId — never reads activeNote.id to avoid cross-note corruption
    if (title.value === savedTitle.value && content.value === savedContent.value)
      return

    await notesStore.updateNote(noteId.value, {
      title: title.value,
      content: content.value,
    })
    savedTitle.value = title.value
    savedContent.value = content.value
    updatedAt.value = new Date()
  },
)

const timeAgo = useTimeAgo(updatedAt as Ref<Date>)

const lastEditedText = computed(() => {
  if (isSaving.value)
    return 'Saving...'
  if (!updatedAt.value)
    return ''
  return `Edited ${timeAgo.value}`
})

const debouncedSave = useDebounceFn(async () => {
  try {
    await saveNote()
  }
  catch {
    errorToast({
      title: 'Auto-save failed',
      description: 'Your changes could not be saved.',
    })
  }
}, 3000)

// Autosave on content or title changes
watch([title, content], () => {
  debouncedSave()
})

async function handleDelete() {
  const { confirm } = useConfirm({
    title: 'Delete Note',
    body: `Delete "${title.value || 'Untitled'}"? This action is permanent and cannot be undone.`,
    confirmBtnProps: { label: 'Delete', color: 'error' },
    onConfirm: async () => {
      await notesStore.deleteNote(noteId.value)
      await navigateTo('/app')
    },
  })

  try {
    await confirm()
  }
  catch {
    errorToast({ title: 'Failed to delete note', description: 'An error occurred while deleting the note.' })
  }
}

const { data: note } = await useAsyncData(
  `note-${noteId.value}`,
  () => $fetch(`/api/notes/${noteId.value}`),
)

// Init local refs from fetched note
if (note.value) {
  title.value = note.value.title
  content.value = note.value.content
  savedTitle.value = note.value.title
  savedContent.value = note.value.content
  updatedAt.value = note.value.updatedAt
}

// Warn on tab close/refresh if there are unsaved changes
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (title.value === savedTitle.value && content.value === savedContent.value)
    return
  e.preventDefault()
}

useEventListener(window, 'beforeunload', handleBeforeUnload)

// Save before navigation — use noteId.value (route param) as the authoritative id,
// never activeNote.id which may already point to the next note during fast nav.
onBeforeRouteLeave(async () => {
  if (title.value !== savedTitle.value || content.value !== savedContent.value) {
    try {
      await notesStore.updateNote(noteId.value, {
        title: title.value,
        content: content.value,
      })
    }
    catch {
      // Silently fail on navigation save
    }
  }
})

const editorExtensions = [
  TaskList,
  TaskItem,
]
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Editor -->
    <template v-if="note">
      <div class="flex items-center justify-between mb-6 px-8 pt-6">
        <UBreadcrumb :items="breadcrumbItems" />
        <div class="flex items-center gap-3">
          <span class="text-sm text-dimmed">
            {{ lastEditedText }}
          </span>
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="handleDelete"
          />
        </div>
      </div>

      <!-- Title -->
      <input
        v-model="title"
        type="text"
        placeholder="Untitled"
        class="w-full px-8 text-2xl font-bold bg-transparent border-none outline-none mb-4 placeholder:text-muted"
      >

      <!-- Rich text editor with bubble toolbar -->
      <UEditor
        v-slot="{ editor }"
        v-model="content"
        content-type="markdown"
        :extensions="editorExtensions"
        placeholder="Start typing..."
        class="w-full grow flex flex-col min-h-0"
      >
        <UEditorToolbar
          :editor="editor"
          :items="bubbleItems"
          layout="bubble"
        />
        <UEditorSuggestionMenu
          :editor="editor"
          :items="slashItems"
        />
        <UEditorDragHandle :editor="editor" />
      </UEditor>
    </template>

    <!-- Not found -->
    <div
      v-else
      class="text-center py-20"
    >
      <h2 class="text-lg font-semibold mb-2">
        Note not found
      </h2>
      <p class="text-muted mb-6">
        This note may have been deleted.
      </p>
      <UButton
        label="Back to Dashboard"
        to="/app"
      />
    </div>
  </div>
</template>
