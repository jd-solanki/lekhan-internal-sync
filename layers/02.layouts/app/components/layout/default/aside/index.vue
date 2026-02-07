<script lang="ts" setup>
</script>

<template>
  <UDashboardSidebar
    :default-size="256"
    toggle-side="right"
    :ui="{
      body: 'px-2 sm:px-2 pt-0',
      header: 'h-14 px-4 sm:px-4',
      root: 'border-none min-h-[calc(100svh-var(--app-banner-height,0px))]',
      content: 'max-w-[256px] divide-none bg-(--ui-bg-muted) dark:bg-black',
      footer: 'px-4 sm:px-4',
    }"
  >
    <template #header>
      <LayoutDefaultAsideHeader />
    </template>

    <LayoutDefaultAsideContent />

    <template #footer>
      <LayoutDefaultAsideFooter />
    </template>
  </UDashboardSidebar>
</template>
