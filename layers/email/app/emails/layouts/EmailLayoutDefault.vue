<script lang="ts" setup>
import env from '~~/server/libs/env'
import EmailComponentCard from '../components/EmailComponentCard.vue'

interface Props {
  subject: string
  preview: string
}

defineProps<Props>()
</script>

<template>
  <EHtml style="background-color: #f8fafc; padding: 24px 0;">
    <EHead>
      <title>{{ subject }}</title>
      <EStyle>
        body {
        margin: 0 !important;
        }
        @media only screen and (max-width: 480px) {
        .email-card {
        padding: 16px !important;
        border-radius: 0px !important;
        }
        }
      </EStyle>
      <EFont
        font-family="Inter"
        :fallback-font-family="['Arial', 'sans-serif']"
        :web-font="{ url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700', format: 'woff2' }"
      />
    </EHead>
    <EBody style="word-break: break-word;">
      <EPreview>{{ preview }}</EPreview>
      <EContainer>
        <EmailComponentCard>
          <ERow style="margin-bottom: 28px;">
            <EColumn style="width: 36px;">
              <EImg
                :src="`${env.NUXT_PUBLIC_APP_BASE_URL}/logo.png`"
                :alt="`${env.NUXT_PUBLIC_APP_NAME} logo`"
                :width="30"
                :height="30"
              />
            </EColumn>
            <EColumn>
              <EHeading
                as="h2"
                style="
                font-size: 20px;
                color: #333333;
                font-weight: bold;
              "
              >
                {{ env.NUXT_PUBLIC_APP_NAME }}
              </EHeading>
            </EColumn>
          </ERow>
          <slot />
          <EText style="font-size: 12px; color: #999999; margin-top: 32px;">
            &copy; {{ new Date().getFullYear() }} {{ env.NUXT_PUBLIC_APP_NAME }}. All rights reserved.
          </EText>
        </EmailComponentCard>
      </EContainer>
    </EBody>
  </EHtml>
</template>
