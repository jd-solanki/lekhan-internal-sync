export function showVersionUpdatedToast() {
  const { isNewVersionAvailable } = useVersionUpdated()
  const toast = useToast()

  function showToast() {
    toast.add({
      title: 'New version of this page is available, kindly refresh to view the new page.',
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
