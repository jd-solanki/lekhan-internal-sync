<script setup lang="ts">
import type { InternalApi } from 'nitropack/types'
import { useTimeAgo } from '@vueuse/core'

type NoteListItem = InternalApi['/api/notes']['get']['data'][number]

const props = defineProps<{ note: NoteListItem }>()
const emit = defineEmits<{ delete: [id: number] }>()

const timeAgo = useTimeAgo(computed(() => new Date(props.note.updatedAt)))
</script>

<template>
  <UCard
    class="cursor-pointer hover:ring-2 hover:ring-muted transition-shadow"
    @click="navigateTo(`/app/notes/${note.id}`)"
  >
    <p class="font-semibold truncate">
      {{ note.title || 'Untitled' }}
    </p>

    <template #footer>
      <div class="flex justify-between items-center">
        <span class="text-xs text-muted">Edited {{ timeAgo }}</span>

        <!-- Stop propagation so card click doesn't fire -->
        <UButton
          icon="i-lucide-trash"
          variant="ghost"
          color="neutral"
          class="text-dimmed"
          size="xs"
          aria-label="Delete note"
          @click.stop="emit('delete', note.id)"
        />
      </div>
    </template>
  </UCard>
</template>
