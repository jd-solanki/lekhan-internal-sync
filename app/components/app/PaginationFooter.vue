<script setup lang="ts">
interface Props {
  totalItems: number
  pageSizeOptions?: number[]
}

withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 50],
})

// Use defineModel for v-model binding
const currentPage = defineModel<number>('currentPage', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })
</script>

<template>
  <div class="flex flex-col md:flex-row items-center flex-wrap gap-4 mt-6 p-4">
    <!-- Results info and page size selector -->
    <div class="text-sm text-muted text-nowrap">
      Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalItems) }} of {{ totalItems }} results
    </div>

    <div class="grow" />

    <!-- Per Page -->
    <div class="flex items-center gap-2">
      <span class="text-muted text-nowrap text-sm">per page</span>
      <USelect
        v-model="pageSize"
        :items="pageSizeOptions"
        class="w-16"
      />
    </div>

    <!-- Pagination component -->
    <UPagination
      v-model:page="currentPage"
      :items-per-page="pageSize"
      :total="totalItems"
      show-edges
      active-variant="subtle"
      class="md:ms-auto"
    />
  </div>
</template>
