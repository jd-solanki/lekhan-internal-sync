<script setup lang="ts">
import type { BadgeProps, TableColumn } from '@nuxt/ui'
import type { Address } from '@polar-sh/sdk/models/components/address.js'
import type { UnwrapRef } from 'vue'
import { ConfirmModal, EditBillingDetailsModal, UBadge, UButton } from '#components'

const cookieRequestedInvoices = useCookie<{ orderId: string, at: Date }[]>('requestedInvoices', { default: () => [] })

const { successToast } = useToastMessage()
const overlay = useOverlay()

// Use pagination composable that handles both page & size
const { currentPage, pageSize } = usePagination()

// Optimized fetch with computed query parameter mapping
const { data: orders, status, refresh: refreshOrders } = await useLazyFetch('/api/polar/orders', {
  query: {
    page: currentPage,
    size: pageSize,
  },
  watch: [currentPage, pageSize],
})

type Order = NonNullable<UnwrapRef<typeof orders>>['result']['items'][number]

const columns: TableColumn<Order>[] = [
  {
    header: 'Product',
    cell: ({ row }) => row.original.product.name,
  },
  {
    header: 'Amount',
    cell: ({ row }) => formatPolarAmount(row.original.totalAmount),
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
    accessorKey: 'billingName',
    header: 'Billing Name',
  },
  {
    accessorKey: 'billingAddress',
    header: 'Billing Address',
  },
  {
    header: 'Purchase Date',
    cell: ({ row }) => row.original.items[0]?.createdAt ? new Date(row.original.items[0].createdAt).toLocaleString() : '',
  },
  {
    accessorKey: 'isInvoiceGenerated',
    header: 'Invoice',
  },
]

// Pagination computed properties
const totalItems = computed(() => orders.value?.result?.pagination?.totalCount || 0)

async function handleInvoiceAction(order: Order) {
  const orderId = order.id

  if (order.isInvoiceGenerated) {
    // View invoice
    const response = await $fetch(`/api/polar/orders/${orderId}/invoice`)

    // Open invoice in new tab (it may auto download)
    window.open(response.url, '_blank')
  }
  else {
    // Prompt to confirm billing address
    const isConfirmed = await overlay.create(ConfirmModal, {
      props: {
        title: 'Confirm Billing Details',
        body: 'Ensure billing details are correct as they can\'t be updated after invoice is generated.',
      },
    }).open()

    if (!isConfirmed)
      return

    // Generate invoice via POST method by passing orderId
    await $fetch(`/api/polar/orders/${orderId}/invoice`, {
      method: 'POST',
    })

    // Refresh orders after a short delay to allow backend processing
    setTimeout(() => refreshOrders(), 5000)

    cookieRequestedInvoices.value.push({ orderId, at: new Date() })

    successToast({
      title: 'Invoice requested successfully',
      description: `Your invoice will be ready in a minute.`,
    })
  }
}

async function editBillingDetails(order: Order) {
  const result = await overlay.create(EditBillingDetailsModal, {
    props: {
      orderId: order.id,
      billingName: order.billingName || '',
      billingAddress: order.billingAddress as Address,
    },
  }).open()

  if (result.success) {
    // Refresh the orders data to show updated information
    await refreshOrders()
  }
}

// Computed that returns recent requested invoices
const recentlyRequestedInvoices = computed(() => {
  return cookieRequestedInvoices.value
    .filter((item) => {
      const diff = new Date().getTime() - new Date(item.at).getTime()
      return diff < 1000 * 60 * 1 // 1 minutes
    })
    .map(item => item.orderId)
})

const canEditBillingDetails = (order: Order) => !(order.isInvoiceGenerated || recentlyRequestedInvoices.value.includes(order.id))
</script>

<template>
  <div>
    <AppPageHeader title="Payments" />
    <UTable
      :data="orders?.result.items || []"
      :columns="columns"
      :loading="status === 'pending'"
      class="flex-1"
    >
      <!-- Col: Billing Name -->
      <template #billingName-cell="{ row }">
        <div class="flex items-center gap-2">
          <span class="flex-1">{{ row.original.billingName || '—' }}</span>
          <UButton
            v-if="canEditBillingDetails(row.original)"
            icon="lucide:edit-3"
            variant="ghost"
            size="xs"
            @click="editBillingDetails(row.original)"
          />
        </div>
      </template>

      <!-- Col: Billing Address -->
      <template #billingAddress-cell="{ row }">
        <div class="flex items-center gap-2">
          <UPopover
            mode="hover"
            class="flex-1"
            :open-delay="300"
          >
            <div class="max-w-48 text-ellipsis overflow-hidden">
              <span class="border-b border-dotted">{{ [
                row.original.billingAddress?.line1,
                row.original.billingAddress?.line2,
                row.original.billingAddress?.postalCode,
                row.original.billingAddress?.city,
                row.original.billingAddress?.state,
                row.original.billingAddress?.country,
              ].filter(Boolean).join(', ') || '—' }}</span>
            </div>
            <template #content>
              <UCard :ui="{ root: 'p-0', body: '!py-4 sm:py-6' }">
                <div class="[&>p]:space-x-1 text-sm leading-6">
                  <p>
                    <strong>Address:</strong>
                    <span v-if="row.original.billingAddress?.line1 || row.original.billingAddress?.line2">{{ [row.original.billingAddress?.line1, row.original.billingAddress?.line2].join(', ') }}</span>
                    <em v-else>&lt;empty&gt;</em>
                  </p>

                  <p>
                    <strong>Postal Code:</strong>
                    <span v-if="row.original.billingAddress?.postalCode">{{ row.original.billingAddress?.postalCode }}</span>
                    <em v-else>&lt;empty&gt;</em>
                  </p>
                  <p>
                    <strong>City:</strong>
                    <span v-if="row.original.billingAddress?.city">{{ row.original.billingAddress?.city }}</span>
                    <em v-else>&lt;empty&gt;</em>
                  </p>
                  <p>
                    <strong>State:</strong>
                    <span v-if="row.original.billingAddress?.state">{{ row.original.billingAddress?.state }}</span>
                    <em v-else>&lt;empty&gt;</em>
                  </p>
                  <p>
                    <strong>Country:</strong>
                    <span v-if="row.original.billingAddress?.country">{{ row.original.billingAddress?.country }}</span>
                    <em v-else>&lt;empty&gt;</em>
                  </p>
                </div>
              </UCard>
            </template>
          </UPopover>
          <UButton
            v-if="canEditBillingDetails(row.original)"
            icon="lucide:edit-3"
            variant="ghost"
            size="xs"
            @click="editBillingDetails(row.original)"
          />
        </div>
      </template>

      <!-- Col: Invoice -->
      <template #isInvoiceGenerated-cell="{ row }">
        <UButton
          variant="soft"
          loading-auto
          :loading="recentlyRequestedInvoices.includes(row.original.id) && !row.original.isInvoiceGenerated"
          :icon="row.original.isInvoiceGenerated ? 'lucide:eye' : 'lucide:file-text'"
          @click="handleInvoiceAction(row.original)"
        >
          {{ row.original.isInvoiceGenerated ? 'View' : 'Generate' }} Invoice
        </UButton>
      </template>
    </UTable>

    <!-- Pagination Controls -->
    <AppPaginationFooter
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total-items="totalItems"
    />
  </div>
</template>
