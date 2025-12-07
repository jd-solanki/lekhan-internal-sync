export function showVersionUpdatedToast() {
  const { isNewVersionAvailable } = useVersionUpdated()
  const toast = useToast()

  function showToast() {
    toast.add({
      title: 'A new version of this page is available',
      description: 'Refresh to see the latest changes.',
      progress: false,
      duration: Infinity,
      actions: [{
        icon: 'i-lucide-refresh-cw',
        label: 'Refresh',
        onClick: () => window.location.reload(),
      }],
    })
  }

  watch(isNewVersionAvailable, (newVal) => {
    if (newVal) {
      showToast()
    }
  }, { once: true })
}
