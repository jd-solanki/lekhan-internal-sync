<script setup lang="ts">
import env from '#server/libs/env'
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

const localSetupInstructionsUrl = 'https://nuxtstart.com/docs/getting-started/introduction'
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
      You now have everything you need to start building your SaaS faster with a clean, production-ready Nuxt.js foundation.
    </EText>

    <EButton
      :href="localSetupInstructionsUrl"
      style="
        background-color: #000;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      "
    >
      Local Setup Instructions
    </EButton>

    <EHeading
      style="
        margin-top: 30px;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        margin-bottom: 12px;
      "
    >
      What you get
    </EHeading>
    <EText style="margin-bottom: 0px;">
      • Access to the
      <ELink href="https://discord.gg/xXPJRpnv">
        <span>Discord server</span>
      </ELink>
      for support & questions
    </EText>
    <EText style="margin: 0px;">
      • Download invoice and purchase key at <ELink href="https://nuxtstart.com/polar/customer-portal">
        Polar customer portal
      </ELink>
    </EText>
    <EText style="margin-top: 0px;">
      • Ongoing updates and improvements to {{ env.NUXT_PUBLIC_APP_NAME }}
    </EText>

    <EText style="margin-bottom: 16px;">
      If you get stuck at any point, just ping me in Discord - happy to help.
    </EText>
    <EText style="margin-bottom: 0px;">
      — JD Solanki<br>
      Founder, <strong>{{ env.NUXT_PUBLIC_APP_NAME }}</strong>
    </EText>

    <EHr style="margin-top: 24px; margin-bottom: 24px;" />

    <EText style="margin-bottom: 0px; font-size: 12px; color: #666666;">
      If you're having trouble clicking the "Local Setup Instructions" button or want to open in different browser window, copy and paste the following URL into your web browser:
    </EText>
    <ELink
      :href="localSetupInstructionsUrl"
      style="font-size: 12px; color: #1a73e8; text-decoration: underline; word-break: break-all; color: #666666;"
    >
      {{ localSetupInstructionsUrl }}
    </ELink>
  </EmailLayoutDefault>
</template>
