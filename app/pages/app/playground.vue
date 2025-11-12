<script lang="ts" setup>
const bannerStore = useBannerStore()
const { errorToast } = useToastMessage()
const commandPaletteStore = useCommandPalette()

function toggleBanner() {
  bannerStore.props.title = bannerStore.props.title ? undefined : 'Hey there 👋🏻'
}

async function asyncOperation() {
  await useConfirm({
    title: 'Are you sure?',
    body: 'This modal won\'t get closed if there\'s an error during the operation. As DX perspective it won\'t close while its processing async operation.',
    confirmBtnProps: { label: 'Random Success', color: 'primary' },
    async onConfirm() {
      await new Promise((resolve, reject) => {
        // Random success or failure
        const isSuccess = Math.random() > 0.5

        // eslint-disable-next-line no-console
        console.log('isSuccess :>> ', isSuccess)

        setTimeout(isSuccess ? resolve : reject, 3000)
      }).then(() => {
        // eslint-disable-next-line no-console
        console.log('success')
      }).catch((e) => {
        errorToast({
          title: 'Operation Failed',
          description: 'Something went wrong during the operation.',
        })

        throw e
      })
    },
  }).confirm()
}

commandPaletteStore.setPageActions([
  // eslint-disable-next-line no-console
  { icon: 'i-lucide-chrome', label: 'Log to Console', onSelect: () => console.log('Hey There!') },
  { icon: 'i-lucide-bell', label: 'Toggle Banner', onSelect: () => toggleBanner() },
  { icon: 'i-lucide-activity', label: 'Async Operation', onSelect: () => asyncOperation() },
])
</script>

<template>
  <div>
    <AppPageHeader
      title="Playground"
      description="Showcasing various components and functionalities we provide."
    />
    <div class="space-y-6 space-x-6">
      <UButton @click="toggleBanner">
        Toggle Banner
      </UButton>

      <UButton @click="asyncOperation">
        Make Async Operation After Confirmation
      </UButton>

      <UBanner title="Banner in page." />

      <UAlert
        title="Page Actions"
        color="info"
        variant="subtle"
        description="We also support page level actions in command palette. Press `cmd + k` to view available page actions."
      />

      <!-- <div class="bg-muted h-[900px] rounded-xl" /> -->
    </div>
  </div>
</template>
