<script setup lang="ts">
interface Props {
  total: number
  pageSizeOptions?: number[]
}

withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 50],
})

// Use defineModel for v-model binding
const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })
</script>

<template>
  <div class="flex flex-col md:flex-row items-center flex-wrap gap-4 mt-6 p-4">
    <!-- Results info and page size selector -->
    <div class="text-sm text-muted text-nowrap">
      Showing {{ ((page - 1) * pageSize) + 1 }} to {{ Math.min(page * pageSize, total) }} of {{ total }} results
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
      v-model:page="page"
      :items-per-page="pageSize"
      :total="total"
      show-edges
      active-variant="soft"
      class="md:ms-auto"
    />
  </div>
</template>
