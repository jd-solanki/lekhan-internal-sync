<script lang="ts" setup>
import type { Table as TanStackTable } from '@tanstack/vue-table'

const props = defineProps<{
  tableApi: TanStackTable<unknown> | undefined
  columnVisibility: Record<string, boolean>
}>()

// Indicates if any column (that can be hidden) is currently hidden
const hasHiddenColumns = computed<boolean>(() => {
  // Primary: rely on v-model state which is reactive
  const visibility = props.columnVisibility || {}
  if (Object.values(visibility).includes(false))
    return true

  // Fallback: inspect TanStack Table API (covers default hidden columns before any interaction)
  const cols = props.tableApi?.getAllColumns?.() ?? []
  if (cols.length)
    return cols.some(c => c.getCanHide?.() && !c.getIsVisible?.())

  return false
})
</script>

<template>
  <UChip
    :show="hasHiddenColumns"
    color="neutral"
    variant="outline"
  >
    <UDropdownMenu
      :items="
        (props.tableApi?.getAllColumns?.() ?? [])
          .filter(column => column.getCanHide?.())
          .map(column => ({
            label: toTitleCase(column.id),
            type: 'checkbox' as const,
            checked: !!column.getIsVisible?.(),
            onUpdateChecked(checked: boolean) {
              props.tableApi?.getColumn?.(column.id)?.toggleVisibility?.(!!checked)
            },
            onSelect(e?: Event) {
              e?.preventDefault()
            },
          }))
      "
      :content="{ align: 'end' }"
      :ui="{ content: 'w-40' }"
    >
      <UButton
        label="Columns"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-chevron-down"
      />
    </UDropdownMenu>
  </UChip>
</template>
