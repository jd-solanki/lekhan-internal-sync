<script setup lang="ts">
import env from '#server/libs/env'
import { BRAND_COLOR } from '~~/layers/email/shared/utils/constants'
import EmailLayoutDefault from './layouts/EmailLayoutDefault.vue'

export interface Props {
  subject: string
  name: string
}

defineProps<Props>()

// INFO: If you ever want to preview this email in the browser, use `withDefaults` and provide default values for the props.
// Example:
// const props = withDefaults(defineProps<Props>(), {
//   subject: 'Welcome to NuxtStart!',
//   name: 'John Doe',
// })
const actionBtnUrl = 'https://www.lekhan.nuxtstart.com/app'
</script>

<template>
  <EmailLayoutDefault
    :subject="subject"
    preview="Get repo access, set up locally, and start building today."
  >
    <EHeading
      style="
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      "
    >
      Hi {{ name }},
    </EHeading>
    <EText>
      Welcome to <strong>{{ env.NUXT_PUBLIC_APP_NAME }}</strong> - you're officially in 🚀
    </EText>
    <EText>
      Explore simple and elegant note-taking experience with markdown support. Whether you're jotting down quick thoughts or crafting detailed documents.
    </EText>

    <EButton
      :href="actionBtnUrl"
      :style="{ backgroundColor: BRAND_COLOR }"
      style="
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      "
    >
      Create Your First Note
    </EButton>

    <EText style="margin-bottom: 0px;">
      — JD Solanki<br>
      Founder, <strong>{{ env.NUXT_PUBLIC_APP_NAME }}</strong>
    </EText>

    <EHr style="margin-top: 24px; margin-bottom: 24px;" />

    <EText style="margin-bottom: 0px; font-size: 12px; color: #666666;">
      If you're having trouble clicking the "Create Your First Note" button or want to open in different browser window, copy and paste the following URL into your web browser:
    </EText>
    <ELink
      :href="actionBtnUrl"
      style="font-size: 12px; color: #1a73e8; text-decoration: underline; word-break: break-all; color: #666666;"
    >
      {{ actionBtnUrl }}
    </ELink>
  </EmailLayoutDefault>
</template>
