import type { Props as EmailActionButtonProps } from '~~/emails/EmailActionButton.vue'

export async function renderEmailActionButton(props: EmailActionButtonProps) {
  return $fetch('/api/emails/render', {
    method: 'POST',
    body: {
      name: 'EmailActionButton',
      props,
    },
  })
}
