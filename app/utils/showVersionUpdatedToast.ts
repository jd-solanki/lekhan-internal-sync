export function showVersionUpdatedToast() {
  const { isNewVersionAvailable } = useVersionUpdated()
  const toast = useToast()

  function showToast() {
    toast.add({
      title: 'New version available.',
      progress: false,
      actions: [{
        icon: 'i-lucide-refresh-cw',
        label: 'Refresh',
        onClick: () => window.location.reload(),
      }],
    })
  }

  watch(isNewVersionAvailable, (newVal) => {
    if (newVal) {
      onMounted(() => {
        showToast()
      })
    }
  }, { once: true })
}
