<script setup lang="ts">
import type { BadgeProps, TableColumn } from '@nuxt/ui'
import type { UnwrapRef } from 'vue'
import { ConfirmModal, UBadge, UButton } from '#components'

const { successToast } = useToastMessage()
const overlay = useOverlay()
const { data, status } = await useLazyFetch('/api/polar/orders')

type Order = NonNullable<UnwrapRef<typeof data>>['result']['items'][number]

const columns: TableColumn<Order>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        'color': 'neutral',
        'variant': 'ghost',
        'icon': 'i-lucide-chevron-down',
        'square': true,
        'aria-label': 'Expand',
        'ui': {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : '',
          ],
        },
        'onClick': () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    header: 'Purchase Date',
    cell: ({ row }) => row.original.items[0]?.createdAt ? new Date(row.original.items[0].createdAt).toLocaleString() : '',
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
    accessorKey: 'isInvoiceGenerated',
    header: 'Invoice',
  },
]

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

    successToast({
      title: 'Invoice requested successfully',
      description: `You'll shortly receive an email with your invoice.`,
    })
  }
}
</script>

<template>
  <div>
    <AppPageHeader title="Payments" />
    <!-- TODO: Add pagination -->
    <UTable
      :data="data?.result.items || []"
      :columns="columns"
      :loading="status === 'pending'"
      class="flex-1"
    >
      <!-- Expanded row -->
      <template #expanded="{ row }">
        <p class="mb-2">
          Purchased Items:
        </p>
        <ul class="list-disc list-inside space-y-1">
          <li
            v-for="p in row.original.items"
            :key="p.id"
            class="space-x-2"
          >
            <span>{{ p.label }}</span>
            <span>({{ formatPolarAmount(p.amount) }})</span>
          </li>
        </ul>
      </template>
      <!-- Col: Billing Address -->
      <template #billingAddress-cell="{ row }">
        <UPopover mode="hover">
          <div class="max-w-48 text-ellipsis overflow-hidden">
            <span class="border-b border-dotted">{{ [
              row.original.billingAddress?.line1,
              row.original.billingAddress?.line2,
              row.original.billingAddress?.postalCode,
              row.original.billingAddress?.city,
              row.original.billingAddress?.state,
              row.original.billingAddress?.country,
            ].filter(Boolean).join(', ') }}</span>
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
      </template>

      <!-- Col: Invoice -->
      <template #isInvoiceGenerated-cell="{ row }">
        <UButton
          variant="soft"
          loading-auto
          :icon="row.original.isInvoiceGenerated ? 'lucide:eye' : 'lucide:file-text'"
          @click="handleInvoiceAction(row.original)"
        >
          {{ row.original.isInvoiceGenerated ? 'View' : 'Generate' }} Invoice
        </UButton>
      </template>
    </UTable>
  </div>
</template>
