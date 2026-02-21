<script setup lang="ts">
import { BRAND_COLOR } from '~~/layers/email/shared/utils/constants'
import EmailLayoutDefault from './layouts/EmailLayoutDefault.vue'

export interface Props {
  emailPreview: string
  emailSubject: string
  name: string
  message: string
  btnText: string
  btnUrl: string
}

// INFO: If you ever want to preview this email in the browser, use `withDefaults` and provide default values for the props.
// Example:
// const props = withDefaults(defineProps<Props>(), {
//  /* props */
// })

defineProps<Props>()
</script>

<template>
  <EmailLayoutDefault
    :subject="emailSubject"
    :preview="emailPreview"
  >
    <EHeading
      style="
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      "
    >
      Hey {{ name }},
    </EHeading>
    <EText>
      {{ message }}
    </EText>
    <EButton
      :href="btnUrl"
      :style="{ backgroundColor: BRAND_COLOR }"
      style="
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      "
    >
      {{ btnText }}
    </EButton>
    <EHr style="margin-top: 24px; margin-bottom: 24px;" />
    <EText style="margin-bottom: 0px; font-size: 12px; color: #666666;">
      If you're having trouble clicking the "{{ btnText }}" button or want to open in different browser window, copy and paste the following URL into your web browser:
    </EText>
    <ELink
      :href="btnUrl"
      style="font-size: 12px; color: #1a73e8; text-decoration: underline; word-break: break-all; color: #666666;"
    >
      {{ btnUrl }}
    </ELink>
  </EmailLayoutDefault>
</template>
