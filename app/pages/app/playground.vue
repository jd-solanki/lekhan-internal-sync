<script lang="ts" setup>
const bannerStore = useBannerStore()
const { errorToast } = useToastMessage()

function toggleBanner() {
  bannerStore.props.title = bannerStore.props.title ? undefined : 'Hey there 👋🏻'
}

async function asyncOperation() {
  await useConfirm({
    title: 'Are you sure?',
    body: 'This action cannot be undone.',
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
</script>

<template>
  <div>
    <AppPageHeader
      title="Playground"
      description="Experiment with your ideas here!"
    />
    <div class="space-y-6 space-x-6">
      <UButton @click="toggleBanner">
        Toggle Banner
      </UButton>

      <UButton @click="asyncOperation">
        Make Async Operation After Confirmation
      </UButton>

      <UBanner title="Banner in page." />

      <div class="bg-muted h-[900px] rounded-xl" />
    </div>
  </div>
</template>
