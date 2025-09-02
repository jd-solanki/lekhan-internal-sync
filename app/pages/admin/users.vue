<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { UIcon } from '#components'
import * as z from 'zod'

definePageMeta({
  isAdminOnly: true,
})

// Query
const { q, qDebounced } = useSearchQuery()

// Query Field
const queryFields = ['name', 'email'] as const
const parsedQuery = useParsedQuery(paginationSchema.extend({
  qField: z.enum(queryFields).default('name'),
}), { page: 1, size: 10 })

// Sorting state (TanStack Table sorting model)
type Sorting = { id: string, desc: boolean }[]
const sorting = ref<Sorting>([])

// Reactive server query using commented params
const { data: users, pending: isLoading } = useLazyAsyncData(
  'authClient.admin.listUsers',
  async () => {
    const res = await authClient.admin.listUsers({
      query: {
        searchValue: qDebounced.value || undefined,
        searchField: parsedQuery.value.qField,
        searchOperator: 'contains',
        // Sorting
        sortBy: sorting.value[0]?.id,
        sortDirection: sorting.value[0]?.desc ? 'desc' : sorting.value[0] ? 'asc' : undefined,
        // Filtering (Better Auth supports a single filter at a time)
        // filterField: effectiveFilter.value?.field,
        // filterOperator: effectiveFilter.value?.operator,
        // filterValue: effectiveFilter.value?.value as any,
        limit: parsedQuery.value.size,
        offset: (parsedQuery.value.page - 1) * parsedQuery.value.size,
      },
    })
    return res?.data
  },
  { watch: [qDebounced, () => parsedQuery.value.qField, sorting, () => parsedQuery.value.page, () => parsedQuery.value.size], server: false, immediate: true },
)

// Reset to first page when search/filter changes
watch(
  [qDebounced, () => parsedQuery.value.qField, sorting],
  () => {
    if (parsedQuery.value.page !== 1)
      parsedQuery.value.page = 1
  },
)

// Ensure visible loading state on initial mount and during refetches
const isTableLoading = computed(() => isLoading.value || !users.value)

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  { accessorKey: 'name', header: 'User' },
  {
    accessorKey: 'emailVerified',
    header: 'Email Verified',
    cell: ({ row }) => (row.getValue('emailVerified')
      ? h(UIcon, { name: 'i-lucide-badge-check', class: 'text-blue-400 text-lg' })
      : h(UIcon, { name: 'i-lucide-circle-x', class: 'text-lg' })),
  },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'banned',
    header: 'Banned',
    cell: ({ row }) => row.getValue('banned') ? 'Yes' : 'No',
  },
  {
    accessorKey: 'banReason',
    header: 'Ban Reason',
    cell: ({ row }) => (row.getValue('banReason') && String(row.getValue('banReason')).trim() !== '' ? String(row.getValue('banReason')) : '-'),
  },
  {
    accessorKey: 'banExpires',
    header: 'Ban Expires',
    cell: ({ row }) => (row.getValue('banExpires') ? new Date(String(row.getValue('banExpires'))).toLocaleString() : '-'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    // UI rendered via slot
  },
]
</script>

<template>
  <div>
    <AppPageHeader title="Users">
      <template #actions>
        <div class="mb-4 flex items-center gap-2">
          <!-- Search Users -->
          <UButtonGroup>
            <SearchInput
              v-model="q"
              placeholder="Search users"
              class="max-w-md"
              icon="i-lucide-search"
            />

            <USelect
              v-model="parsedQuery.qField"
              :items="[...queryFields]"
            />
          </UButtonGroup>
        </div>
      </template>
    </AppPageHeader>

    <UTable
      v-model:sorting="sorting"
      :data="users?.users ?? []"
      :columns="columns"
      :loading="isTableLoading"
      class="w-full"
    >
      <!-- Sortable headers for selected columns -->
      <template #id-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="ID"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #name-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="User"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #role-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Role"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #createdAt-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Created"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #updatedAt-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Updated"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>

      <!-- User (name) column cell slot: avatar + name + email -->
      <template #name-cell="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="row?.original?.image || undefined"
            :text="getInitials(row?.original?.name)"
            :alt="`${row?.original?.name} avatar`"
            size="sm"
          />
          <div class="flex flex-col">
            <span class="font-medium text-highlighted">{{ row?.original?.name }}</span>
            <span class="text-sm text-muted">{{ row?.original?.email }}</span>
          </div>
        </div>
      </template>

      <!-- Actions column cell slot: dropdown trigger/button -->
      <template #actions-cell>
        <UDropdownMenu
          :items="[
            { label: 'Impersonate User', icon: 'i-lucide-user-check', onSelect: () => {} },
            { label: 'Ban User', icon: 'i-lucide-user-x', onSelect: () => {} },
            { label: 'Delete User', icon: 'i-lucide-trash', onSelect: () => {} },
          ]"
        >
          <UButton
            icon="i-lucide-more-horizontal"
            variant="ghost"
            size="sm"
            aria-label="Actions"
          />
        </UDropdownMenu>
      </template>
    </UTable>

    <TablePagination
      v-model:page="parsedQuery.page"
      v-model:page-size="parsedQuery.size"
      :total="users?.total ?? (users?.users?.length || 0)"
      :page-size-options="[5, 10]"
    />
  </div>
</template>
