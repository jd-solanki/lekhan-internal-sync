<script setup lang="ts">
import type { BadgeProps, TableColumn } from '@nuxt/ui'
import type { UnwrapRef } from 'vue'
import { UBadge } from '#components'

definePageMeta({
  search: {
    label: 'Orders',
    icon: 'i-lucide-shopping-bag',
  },
})

// Query Field
const parsedQuery = useParsedQuery(paginationSchema)

// Optimized fetch with computed query parameter mapping
const { data: orders, status } = await useFetch('/api/polar/orders', {
  query: {
    page: parsedQuery.value.page,
    size: parsedQuery.value.size,
  },
  watch: [() => parsedQuery.value.page, () => parsedQuery.value.size],
})

type Order = NonNullable<UnwrapRef<typeof orders>>['result']['items'][number]

const columns: TableColumn<Order>[] = [
  {
    header: 'Product',
    cell: ({ row }) => h(
      'span',
      { class: 'font-semibold' },
      row.original.product!.name,
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

// Pagination computed properties
const totalItems = computed(() => orders.value?.result?.pagination?.totalCount || 0)
</script>

<template>
  <div>
    <AppPageHeader title="Orders" />
    <UTable
      :data="orders?.result.items || []"
      :columns="columns"
      :loading="status === 'pending'"
      class="flex-1"
    />

    <!-- Pagination -->
    <TablePagination
      v-model:page="parsedQuery.page"
      v-model:page-size="parsedQuery.size"
      :total="totalItems"
    />
  </div>
</template>
