<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Address } from '@polar-sh/sdk/models/components/address'

const props = defineProps<{
  orderId: string
  billingName: string | null
  billingAddress: Address
}>()

const emit = defineEmits<{
  close: [result: { success: false } | { success: true, billingName: string | null, billingAddress: Address }]
}>()

const { errorToast, successToast } = useToastMessage()

const refForm = useTemplateRef('refForm')

const state = reactive<SchemaPolarOrderBillingAddress & SchemaPolarOrderBillingName>({
  billingName: props.billingName,
  line1: props.billingAddress.line1,
  line2: props.billingAddress.line2,
  postalCode: props.billingAddress.postalCode,
  city: props.billingAddress.city,
  state: props.billingAddress.state,
  country: props.billingAddress.country,
})

async function onSubmit(event: FormSubmitEvent<SchemaPolarOrderBillingAddress & SchemaPolarOrderBillingName>) {
  const { billingName, ...billingAddress } = event.data

  try {
    // Call API to update billing details
    await $fetch(`/api/polar/orders/${props.orderId}`, {
      method: 'PATCH',
      body: {
        billingName,
        billingAddress,
      },
    })

    successToast({
      title: 'Success',
      description: 'Billing details updated successfully',
    })

    emit('close', {
      success: true,
      billingName,
      billingAddress,
    })
  }
  catch (error: any) {
    console.error('Failed to update billing details:', error)

    errorToast({
      title: 'Error',
      description: error?.data?.message || 'Failed to update billing details',
    })
  }
}

function onCancel() {
  emit('close', { success: false })
}
</script>

<template>
  <UModal
    title="Edit Billing Details"
    :close="{ onClick: onCancel }"
  >
    <template #body>
      <UAlert
        variant="soft"
        description="Once an invoice is generated, billing name and address cannot be changed."
        icon="lucide:info"
      />

      <UForm
        ref="refForm"
        :schema="schemaPolarOrderBillingUpdateFlatten"
        :state="state"
        class="grid grid-cols-2 gap-4 mt-6"
        @submit="onSubmit"
      >
        <UFormField
          label="Billing Name"
          name="billingName"
          required
          class="col-span-2"
        >
          <UInput
            v-model="state.billingName"
            placeholder="Enter billing name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Address Line 1"
          name="line1"
        >
          <UInput
            v-model="state.line1"
            placeholder="Enter street address"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Address Line 2"
          name="line2"
        >
          <UInput
            v-model="state.line2"
            placeholder="Apartment, suite, etc. (optional)"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Postal Code"
          name="postalCode"
        >
          <UInput
            v-model="state.postalCode"
            placeholder="12345"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="City"
          name="city"
        >
          <UInput
            v-model="state.city"
            placeholder="Enter city"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="State"
          name="state"
        >
          <UInput
            v-model="state.state"
            placeholder="California"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Country"
          name="country"
          required
        >
          <CountriesSelectMenu
            v-model="state.country"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          label="Update"
          loading-auto
          @click="refForm?.submit()"
        />
        <UButton
          label="Cancel"
          variant="ghost"
          @click="onCancel"
        />
      </div>
    </template>
  </UModal>
</template>
