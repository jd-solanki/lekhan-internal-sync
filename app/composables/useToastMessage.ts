import type { ToastProps } from '@nuxt/ui'

export function useToastMessage() {
  const toast = useToast()

  const errorToast = (options: Omit<ToastProps, 'color'>) => {
    toast.add({
      ...options,
      color: 'error',
      icon: options.icon || 'i-lucide-circle-alert',
    })
  }

  const successToast = (options: Omit<ToastProps, 'color'>) => {
    toast.add({
      ...options,
      color: 'success',
      icon: options.icon || 'i-lucide-check',
    })
  }

  const infoToast = (options: Omit<ToastProps, 'color'>) => {
    toast.add({
      ...options,
      color: 'info',
      icon: options.icon || 'i-lucide-info',
    })
  }

  return {
    errorToast,
    successToast,
    infoToast,
  }
}
