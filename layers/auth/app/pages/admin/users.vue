<script lang="ts" setup>
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Table as TanStackTable } from '@tanstack/vue-table'
import type { User } from '~~/layers/auth/server/libs/auth'
import { PageAdminUsersBanUserModal, PageAdminUsersCreateUserModal, UIcon } from '#components'
import { createReusableTemplate } from '@vueuse/core'
import * as z from 'zod'

definePageMeta({
  isAdminOnly: true,
  search: {
    label: 'Users',
    icon: 'i-lucide-users',
  },
})

const overlay = useOverlay()
const route = useRoute()
const userStore = useUserStore()
const { successToast, errorToast } = useToastMessage()

// Search query
const { q, qDebounced } = useSearchQuery()

// Query Field
// NOTE: Ensure your sortable cols are in sync with headers that have sorting UI
const SORTABLE_COLS = ['id', 'name', 'role', 'createdAt', 'updatedAt'] as const
const SORTING_DEFAULT = '-createdAt' // Default sorting query param
const queryFields = ['name', 'email'] as const
const parsedQuery = useParsedQuery(paginationSchema.extend({
  qField: z.enum(queryFields).default('name'),
  sorting: z.string().regex(/^[\w-]+$/).default(SORTING_DEFAULT),
}))

// INFO: We need to convert sorting query param to the format that TanStack Table understands
// WARNING: Do not use `z.preprocessor` to `useParsedQuery` as under the hood `useParsedQuery` uses `zod` to parse the query params
//  and you may end up with `[object Object]` in query params.
const sorting = computed({
  get: () => {
    return decodeSortingQuery(
      parsedQuery.value.sorting,
      {
        validKeys: [...SORTABLE_COLS],
        default: [{ id: 'createdAt', desc: true }],
      },
    )
  },
  set: async (val) => {
    if (!val || val.length === 0)
      return

    await navigateTo({
      query: {
        ...route.query,
        sorting: encodeSortingQuery(val),
      },
    })
  },
})

// Build action items per-user so handlers can access the correct userId
function getUserActionItems(user: User & { banned?: boolean }, refresh: ReturnType<typeof useLazyAsyncData>['refresh']): DropdownMenuItem[] {
  const banAction: DropdownMenuItem = {
    label: 'Ban User',
    icon: 'i-lucide-ban',
    onSelect: async () => {
      const result = await overlay.create(PageAdminUsersBanUserModal).open()

      if (!result)
        return

      const banResponse = await userStore.banUser(
        {
          userId: user.id,
          ...result,
        },
        user.name,
      )

      if (!banResponse.error) {
        // Refresh list to show updated ban status
        await refresh()
      }
    },
  }

  const liftBanAction: DropdownMenuItem = {
    label: 'Lift Ban',
    icon: 'i-lucide-circle-play',
    onSelect: async () => {
      await useConfirm({
        title: 'Lift Ban',
        body: `Are you sure you want to lift the ban for user "${user.name}"?`,
        confirmBtnProps: { color: 'primary', label: 'Lift Ban' },
        async onConfirm() {
          const liftBanResponse = await userStore.liftBan({ userId: user.id }, user.name)
          if (!liftBanResponse.error)
            await refresh()
        },
      }).confirm()
    },
  }

  const deactivateUserAction: DropdownMenuItem = {
    label: 'Deactivate User',
    icon: 'i-lucide-user-x',
    onSelect: async () => {
      await useConfirm({
        title: 'Deactivate User',
        body: `Are you sure you want to deactivate user "${user.name}"?. User can reactivate account by signing in.`,
        async onConfirm() {
          await userStore.deactivateUser(user.id, user.name)
          await refresh()
        },
      }).confirm()
    },
  }

  const reactivateUserAction: DropdownMenuItem = {
    label: 'Reactivate User',
    icon: 'i-lucide-user-plus',
    onSelect: async () => {
      userStore.reactivateUser(user.id, user.name)
        .then(async () => await refresh())
    },
  }

  return [
    {
      label: 'Impersonate User',
      icon: 'i-lucide-venetian-mask',
      onSelect: async () => {
        await userStore.impersonateUser(user.id)
      },
    },
    ...(userStore.user && userStore.user.id !== user.id
      ? [user.banned ? liftBanAction : banAction]
      : []),
    user.deactivatedAt ? reactivateUserAction : deactivateUserAction,
    {
      label: 'Hard Delete User',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: async () => {
        await useConfirm({
          title: 'Hard Delete User',
          body: `This action is irreversible. Are you sure you want to remove user ${user.name} and all their data permanently?`,
          confirmBtnProps: { color: 'error', label: 'Delete Permanently' },
          async onConfirm() {
            const { data, error } = await authClient.admin.removeUser({
              userId: user.id,
            })
            if (error || !data || !data.success) {
              errorToast({ title: 'Error', description: error?.message || 'Failed to delete user' })
              return
            }
            successToast({ title: `User "${user.name}" has been deleted` })
            await refresh()
          },
        }).confirm()
      },
    },
  ]
}

// Reactive server query using commented params
const { data: users, pending: isLoading, refresh } = useLazyAsyncData(
  'authClient.admin.listUsers',
  async () => {
    const res = await authClient.admin.listUsers({
      query: {
        // Searching
        searchValue: qDebounced.value || undefined,
        searchField: parsedQuery.value.qField,
        searchOperator: 'contains',

        // Sorting
        sortBy: parsedQuery.value.sorting?.[0]?.id,
        sortDirection: parsedQuery.value.sorting?.[0]?.desc ? 'desc' : parsedQuery.value.sorting?.[0] ? 'asc' : undefined,

        // Pagination
        limit: parsedQuery.value.size ?? 10,
        offset: ((parsedQuery.value.page ?? 1) - 1) * (parsedQuery.value.size ?? 10),
      },
    })
    return res?.data
  },
  { watch: [qDebounced, () => parsedQuery.value.qField, () => parsedQuery.value.sorting, () => parsedQuery.value.page, () => parsedQuery.value.size], server: false, immediate: true },
)

// Reset to first page when search/filter changes
watch(
  [qDebounced, () => parsedQuery.value.qField, () => parsedQuery.value.sorting, () => parsedQuery.value.size],
  () => {
    if (parsedQuery.value.page !== 1)
      parsedQuery.value.page = 1
  },
  // INFO: Important to use 'sync' here to avoid mis-fetching data
  // Case: Set pageSize to 5; Go to 2nd page; Set pageSize to 10; => Doesn't render any data because above `useAsyncData` still gets old page (2) when size changes
  // Which computes offset as 10 (for page size 10), which means even though we reset to page 1 and query reflects to page 1, we're fetching second page.
  { flush: 'sync' },
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
    accessorKey: 'lastSignInAt',
    header: 'Last Sign In At',
    cell: ({ row }) => row.getValue('lastSignInAt') ? new Date(row.getValue('lastSignInAt')).toLocaleString() : '-',
  },
  {
    accessorKey: 'deactivatedAt',
    header: 'Deactivated At',
    cell: ({ row }) => row.getValue('deactivatedAt') ? new Date(row.getValue('deactivatedAt')).toLocaleString() : '-',
  },
  {
    accessorKey: 'banned',
    header: 'Banned',
    // cell: ({ row }) => row.getValue('banned') ? 'Yes' : 'No',
    cell: ({ row }) => (row.getValue('banned')
      ? h(UIcon, { name: 'i-lucide-ban', class: 'text-red-400 text-lg' })
      : h(UIcon, { name: 'i-lucide-circle-x', class: 'text-lg' })),
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
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    // UI rendered via slot
  },
]

async function createUser() {
  // Open Modal to create user
  const result = await overlay.create(PageAdminUsersCreateUserModal).open()

  if (!result)
    return

  // Refresh list to show new user
  await refresh()
}

// Column visibility
const refTable = useTemplateRef<{ tableApi?: TanStackTable<unknown> }>('refTable')
const columnVisibility = useCookie('admin-users-table-column-visibility', { default: () => ({}) })

const [DefineAdditionalActionsTemplate, ReuseAdditionalActionsTemplate] = createReusableTemplate()
</script>

<template>
  <div>
    <DefineAdditionalActionsTemplate>
      <div class="flex flex-wrap gap-2 items-center">
        <!-- Column Visibility -->
        <TableColumnVisibilityDropdown
          :table-api="refTable?.tableApi"
          :column-visibility
        />
        <!-- Search Users -->
        <UFieldGroup>
          <SearchInput
            v-model="q"
            placeholder="Search users"
            class="w-[170px]"
            icon="i-lucide-search"
          />
          <USelect
            v-model="parsedQuery.qField"
            :items="[...queryFields]"
          />
        </UFieldGroup>
      </div>
    </DefineAdditionalActionsTemplate>

    <AppPageHeader title="Users">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <ReuseAdditionalActionsTemplate class="max-sm:hidden" />

          <!-- Create User -->
          <UButton @click="createUser">
            Create User
          </UButton>
        </div>
      </template>
    </AppPageHeader>

    <ReuseAdditionalActionsTemplate class="sm:hidden justify-between" />

    <UTable
      ref="refTable"
      v-model:column-visibility="columnVisibility"
      v-model:sorting="sorting"
      :data="users?.users ?? []"
      :columns="columns"
      :loading="isTableLoading"
      class="w-full"
    >
      <!-- NOTE: Ensure your sortable cols UI are in sync with SORTABLE_COLS constant -->
      <!-- Sortable headers for selected columns -->
      <template #id-header="{ column }">
        <UButton
          variant="ghost"
          label="ID"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #name-header="{ column }">
        <UButton
          variant="ghost"
          label="User"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #role-header="{ column }">
        <UButton
          variant="ghost"
          label="Role"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #createdAt-header="{ column }">
        <UButton
          variant="ghost"
          label="Created"
          class="-mx-2.5"
          :icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down'"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        />
      </template>
      <template #updatedAt-header="{ column }">
        <UButton
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
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getUserActionItems(toRaw(row?.original), refresh)">
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
    />
  </div>
</template>
