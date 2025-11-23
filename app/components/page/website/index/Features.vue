<script lang="ts" setup>
const authFeatures = [
  {
    icon: 'i-ph-lock-duotone',
    label: 'Password based sign in',
  },
  {
    icon: 'i-ph-link-duotone',
    label: 'Magic Link',
  },
  {
    icon: 'i-ph-shield-check-duotone',
    label: 'Social Auth',
  },
  {
    icon: 'i-ph-password-duotone',
    label: '2FA/OTP',
    badge: 'Coming Soon',
  },
]

const paymentsFeatures = [
  {
    icon: 'i-ph-wrench-duotone',
    label: 'Easy to set up',
  },
  {
    icon: 'i-ph-code-duotone',
    label: 'Exceptional DX',
  },
  {
    icon: 'i-ph-credit-card-duotone',
    label: 'Easy Subscriptions, One Time or Usage (Credits) based billing.',
  },
  {
    icon: 'i-ph-chart-line-up-duotone',
    label: 'Handle tax, compliance & invoicing for you.',
  },
  {
    icon: 'i-ph-download-simple-duotone',
    label: 'License Keys, Private GitHub repo access, Digital Downloads, Discord Server access, and Custom benefits.',
  },
]

const superAdminFeatures = [
  {
    icon: 'i-ph-users-duotone',
    label: 'Manage Users',
  },
  {
    icon: 'i-ph-user-circle-duotone',
    label: 'User Impersonation',
  },
  {
    icon: 'i-ph-prohibit-duotone',
    label: 'Ban/Unban Users',
  },
  {
    icon: 'i-ph-clock-duotone',
    label: 'more...',
    badge: 'Coming Soon',
  },
]

const emailTemplatesFeatures = [
  {
    icon: 'i-ph-envelope-duotone',
    label: 'Pre-built templates for auth, updates, etc.',
  },
  {
    icon: 'i-ph-browser-duotone',
    label: 'DevTool Preview',
  },
  {
    icon: 'i-ph-rocket-duotone',
    label: 'Product Updates',
  },
  {
    icon: 'i-ph-newspaper-duotone',
    label: 'Newsletter',
    badge: 'Coming Soon',
  },
]
</script>

<template>
  <div class="space-y-30">
    <!-- Auth Features -->
    <WebsiteLandingFeature
      title="Authentication"
      :features="authFeatures"
    >
      <template #description>
        <span>We use </span>
        <ULink
          href="https://www.better-auth.com/"
          target="_blank"
        >
          <span class="underline">BetterAuth</span>
        </ULink>
        <span> to help you ship battle-tested & easy to extend auth system. It will cover all authentication needs without rolling your own auth.</span>
      </template>
    </WebsiteLandingFeature>

    <!-- Payments Features -->
    <WebsiteLandingFeature
      title="Payments"
      :features="paymentsFeatures"
      class="lg:flex-row-reverse"
    >
      <template #description>
        <span>We chose </span>
        <ULink
          href="https://polar.sh/"
          target="_blank"
        >
          <span class="underline">Polar</span>
        </ULink>
        <span> to let you charge your customers without fighting with complexities payment system. Polar provides exceptional DX to help you setup payment in no time.</span>
      </template>
    </WebsiteLandingFeature>

    <!-- Super Admin Features -->
    <WebsiteLandingFeature
      title="Super Admin"
      :features="superAdminFeatures"
    >
      <template #description>
        <span>We chose </span>
        <ULink
          href="https://polar.sh/"
          target="_blank"
        >
          <span class="underline">Polar</span>
        </ULink>
        <span> to let you charge your customers without fighting with complexities payment system. Polar provides exceptional DX to help you setup payment in no time.</span>
      </template>
    </WebsiteLandingFeature>

    <!-- Email Templates Features -->
    <WebsiteLandingFeature
      title="Email Templates"
      :features="emailTemplatesFeatures"
      class="lg:flex-row-reverse"
    >
      <template #description>
        <span>We chose </span>
        <ULink
          href="https://polar.sh/"
          target="_blank"
        >
          <span class="underline">Polar</span>
        </ULink>
        <span> to let you charge your customers without fighting with complexities payment system. Polar provides exceptional DX to help you setup payment in no time.</span>
      </template>
    </WebsiteLandingFeature>
  </div>
</template>
