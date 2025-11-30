import type { ConfirmModalProps } from '~~/layers/launchdayone-core/app/components/ConfirmModal.vue'
import { ConfirmModal } from '#components'

export function useConfirm(modalProps: ConfirmModalProps) {
  const overlay = useOverlay()
  const modalIns = overlay.create(ConfirmModal, { props: modalProps })

  // Returns the resolved value from the ConfirmModal (truthy when confirmed, falsy when canceled)
  const confirm = async () => {
    return await modalIns.open()
  }

  return { confirm }
}
