<script lang="ts" setup>
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { FetchError } from 'ofetch'
import type { User } from '~~/server/libs/auth'
import { ConfirmModal, PageAdminUsersBanUserModal, PageAdminUsersCreateUserModal, UIcon } from '#components'
import * as z from 'zod'

definePageMeta({
  isAdminOnly: true,
})

// Query
const overlay = useOverlay()
const { q, qDebounced } = useSearchQuery()
const userStore = useUserStore()
const { successToast, errorToast } = useToastMessage()

// Query Field
const queryFields = ['name', 'email'] as const
const parsedQuery = useParsedQuery(paginationSchema.extend({
  qField: z.enum(queryFields).default('name'),
}), { page: 1, size: 10 })

// Sorting state
// INFO: Default sorting by createdAt desc
type Sorting = { id: string, desc: boolean }[]
const sorting = ref<Sorting>([{ id: 'createdAt', desc: true }])

// Build action items per-user so handlers can access the correct userId
function getUserActionItems(user: User & { banned?: boolean }, refresh: ReturnType<typeof useLazyAsyncData>['refresh']): DropdownMenuItem[] {
  const banAction: DropdownMenuItem = {
    label: 'Ban User',
    icon: 'i-lucide-ban',
    onSelect: async () => {
      console.warn('Banning user', user)
      const result = await overlay.create(PageAdminUsersBanUserModal).open()

      console.warn('result :>> ', result)

      if (!result)
        return

      // Call API to ban user
      const banRes = await authClient.admin.banUser({
        userId: user.id,
        ...result,
      })

      if (banRes?.error) {
        errorToast({
          title: 'Failed to ban user',
          description: banRes.error.message || 'You cannot ban this user.',
        })
        return
      }

      successToast({
        title: `User "${user.name}" has been banned`,
        description: result.banExpiresIn ? `Ban Expires at ${new Date(Date.now() + result.banExpiresIn * 1000).toLocaleString()}` : 'Ban is permanent',
      })

      // Refresh list to show updated ban status
      await refresh()
    },
  }

  const liftBanAction: DropdownMenuItem = {
    label: 'Lift Ban',
    icon: 'i-lucide-user-check',
    onSelect: async () => {
      console.warn('Lifting ban for user', user)
      const result = await overlay.create(ConfirmModal, {
        props: {
          title: 'Lift Ban',
          body: `Are you sure you want to lift the ban for user "${user.name}"?`,
          confirmBtnProps: { color: 'primary', label: 'Lift Ban' },
        },
      }).open()

      if (!result)
        return

      // Call API to lift ban
      const unbanRes = await authClient.admin.unbanUser({
        userId: user.id,
      })

      if (unbanRes?.error) {
        errorToast({
          title: 'Failed to lift ban',
          description: unbanRes.error.message || 'Unable to lift ban for this user.',
        })
        return
      }

      successToast({
        title: `Ban lifted for user "${user.name}"`,
      })

      // Refresh list to show updated ban status
      await refresh()
    },
  }

  const deactivateUserAction: DropdownMenuItem = {
    label: 'Deactivate User',
    icon: 'i-lucide-user-x',
    onSelect: async () => {
      const result = await overlay.create(ConfirmModal, {
        props: {
          title: 'Deactivate User',
          body: `Are you sure you want to deactivate user "${user.name}"?. User can reactivate account by signing in.`,
        },
      }).open()

      if (!result)
        return

      // Deactivate user by setting `deactivatedAt` col to current timestamp
      // Call API to deactivate user
      await $fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: {
          deactivatedAt: new Date(),
        },
      }).then(async () => {
        successToast({
          title: `User "${user.name}" has been deactivated`,
        })

        // Refresh list to show updated user status
        await refresh()
      }).catch((e) => {
        const error = e as FetchError
        errorToast({
          title: 'Failed to deactivate user',
          description: error.statusMessage || 'Unable to deactivate this user.',
        })
      })
    },
  }

  const reactivateUserAction: DropdownMenuItem = {
    label: 'Reactivate User',
    icon: 'i-lucide-user-plus',
    onSelect: async () => {
      // Reactivate user by setting `deactivatedAt` col to null
      // Call API to reactivate user
      await $fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: {
          deactivatedAt: null,
        },
      }).then(async () => {
        successToast({
          title: `User "${user.name}" has been reactivated`,
        })

        // Refresh list to show updated user status
        await refresh()
      }).catch((e) => {
        const error = e as FetchError
        errorToast({
          title: 'Error',
          description: error.statusMessage || 'Unable to reactivate this user.',
        })
      })
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
    // TODO: Conditionally show deactivate/reactivate based on user.deactivatedAt
    reactivateUserAction,
    deactivateUserAction,
    {
      label: 'Hard Delete User',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: async () => {
        const result = await overlay.create(ConfirmModal, {
          props: {
            title: 'Hard Delete User',
            body: `This action is irreversible. Are you sure you want to remove user ${user.name} and all their data permanently?`,
            confirmBtnProps: { color: 'error', label: 'Delete Permanently' },
          },
        }).open()

        if (!result)
          return

        const { data, error } = await authClient.admin.removeUser({
          userId: user.id,
        })

        if (error || !data || !data.success) {
          errorToast({ title: 'Error', description: error?.message || 'Failed to delete user' })
          return
        }

        successToast({ title: `User "${user.name}" has been deleted` })

        // Refresh list to remove deleted user
        await refresh()
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
        searchValue: qDebounced.value || undefined,
        searchField: parsedQuery.value.qField,
        searchOperator: 'contains',
        // Sorting
        sortBy: sorting.value[0]?.id,
        sortDirection: sorting.value[0]?.desc ? 'desc' : sorting.value[0] ? 'asc' : undefined,
        limit: parsedQuery.value.size ?? 10,
        offset: ((parsedQuery.value.page ?? 1) - 1) * (parsedQuery.value.size ?? 10),
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
</script>

<template>
  <div>
    <AppPageHeader title="Users">
      <template #actions>
        <div class="mb-4 flex items-center gap-2">
          <!-- Search Users -->
          <UFieldGroup>
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
          </UFieldGroup>

          <!-- Create User -->
          <UButton @click="createUser">
            Create User
          </UButton>
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
      :page-size-options="[5, 10]"
    />
  </div>
</template>
