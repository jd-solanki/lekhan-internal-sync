import type { ConfirmModalProps } from '~/components/ConfirmModal.vue'
import { ConfirmModal } from '#components'

export function useConfirm(modalProps: ConfirmModalProps) {
  const overlay = useOverlay()
  const modalIns = overlay.create(ConfirmModal, { props: modalProps })

  const confirm = async () => {
    await modalIns.open()
  }

  return { confirm }
}
