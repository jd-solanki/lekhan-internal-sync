<script setup lang="ts">
import type { BadgeProps, TableColumn } from '@nuxt/ui'
import type { InternalApi } from 'nitropack'
import { UBadge } from '#components'

definePageMeta({
  search: {
    label: 'Orders',
    icon: 'i-lucide-shopping-bag',
  },
})

const userStore = useUserStore()

// Query Field
const parsedQuery = useParsedQuery(paginationSchema)

// Optimized fetch with computed query parameter mapping
const { data: orders, status } = await useFetch('/api/polar/orders', {
  query: parsedQuery,
})

type Order = InternalApi['/api/polar/orders']['get']['orders'][number]

const columns: TableColumn<Order>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
  },
  {
    header: 'Product',
    cell: ({ row }) => h(
      'span',
      { class: 'font-semibold' },
      row.original.items[0]?.label,
    ),
  },
  {
    header: 'Amount',
    cell: ({ row }) => h(
      'span',
      { class: 'font-mono' },
      formatPolarAmount(row.original.totalAmount),
    ),
  },
  {
    header: 'Status',
    // cell: ({ row }) => capitalize(row.original.status),
    cell: ({ row }) => {
      const colorMap: Record<Order['status'], BadgeProps['color']> = {
        paid: 'success',
        pending: 'info',
        refunded: 'neutral',
        partially_refunded: 'neutral',
      }
      const status = row.original.status
      const color = colorMap[status]

      return h(
        UBadge,
        { class: 'capitalize', variant: 'subtle', color },
        () => status,
      )
    },
  },
  {
    header: 'Purchase Date',
    cell: ({ row }) => row.original.items[0]?.createdAt ? new Date(row.original.items[0].createdAt).toLocaleString() : '',
  },
]
</script>

<template>
  <div>
    <AppPageHeader title="Orders" />
    <UTable
      :data="orders?.orders || []"
      :columns="columns"
      :loading="status === 'pending'"
      class="flex-1"
    >
      <!-- Customer column cell slot: avatar + name + email -->
      <template #customer-cell="{ row }">
        <div class="flex items-center gap-3">
          <!-- eslint-disable regex/invalid -->
          <UAvatar
            :src="userStore.getAvatarUrl(row.original.user.image)"
            :text="getInitials(row.original.user.name)"
            :alt="`${row.original.user.name} avatar`"
            size="sm"
          />
          <!-- eslint-enable regex/invalid -->
          <div class="flex flex-col">
            <span class="font-medium text-highlighted">{{ row.original.user.name }}</span>
            <span class="text-sm text-muted">{{ row.original.user.email }}</span>
          </div>
        </div>
      </template>
    </UTable>

    <!-- Pagination -->
    <TablePagination
      v-model:page="parsedQuery.page"
      v-model:page-size="parsedQuery.size"
      :total="orders?.total || 0"
    />
  </div>
</template>
