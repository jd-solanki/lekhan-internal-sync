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

const seoFeatures = [
  {
    label: 'Pre-configured Meta tags',
    icon: 'i-ph-tag-duotone',
  },
  {
    label: 'Social Media OG Images',
    icon: 'i-ph-image-duotone',
  },
  {
    label: 'robots.txt & sitemap.xml',
    icon: 'i-ph-file-duotone',
  },
  {
    label: 'Schema.org Support',
    icon: 'i-ph-line-segments-duotone',
  },
  {
    label: 'Link Checker',
    icon: 'i-ph-link-duotone',
  },
]

const techStackFeatures = [
  {
    label: 'Nuxt UI - Community favorite & accessible UI framework',
    icon: 'i-simple-icons-nuxt',
  },
  {
    label: 'BetterAuth - Battle tested auth library for any kind of authentication needs',
    icon: 'i-ph-key-duotone',
  },
  {
    label: 'Polar - Easy payments with exceptional DX',
    icon: 'i-ph-hand-coins-duotone',
  },
  {
    label: 'DrizzleORM - Most performant ORM to make fastest database queries',
    icon: 'i-ph-database-duotone',
  },
  {
    label: 'and many more',
    icon: 'i-ph-clock-duotone',
  },
]
</script>

<template>
  <div class="lg:space-y-48 space-y-36">
    <!-- Auth Features -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:gap-16 gap-8 items-center">
      <LandingFeature
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
      </LandingFeature>

      <div class="w-full h-[400px] ring-muted/50 overflow-hidden ring-8 rounded-lg">
        <UColorModeImage
          light="/images/landing/sign-in.png"
          dark="/images/landing/sign-in-dark.png"
          alt="Sign in page"
          class="size-full object-cover object-center"
        />
      </div>
    </div>

    <!-- Payments Features -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <LandingFeature
        title="Payments"
        :features="paymentsFeatures"
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
      </LandingFeature>

      <div class="w-full h-[400px] md:col-start-1 md:row-start-1 ring-muted/50 overflow-hidden ring-8 rounded-lg">
        <UColorModeImage
          light="/images/landing/billing-page-ss.png"
          dark="/images/landing/billing-page-ss-dark.png"
          alt="Sign in page"
          class="size-full object-cover object-top-left"
        />
      </div>
    </div>

    <!-- Super Admin Features -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <LandingFeature
        title="Super Admin"
        :features="superAdminFeatures"
      >
        <template #description>
          <span>With Super Admin, you can easily manage your SaaS operations.</span>
        </template>
      </LandingFeature>

      <div class="w-full h-[400px] ring-muted/50 overflow-hidden ring-8 rounded-lg">
        <UColorModeImage
          light="/images/landing/users-page-ss.png"
          dark="/images/landing/users-page-ss-dark.png"
          alt="Sign in page"
          class="size-full object-cover object-top-left"
        />
      </div>
    </div>

    <div class="grid lg:grid-cols-2 grid-cols-1 gap-16">
      <!-- Email Templates Features -->
      <LandingFeature
        title="Email Templates"
        :features="emailTemplatesFeatures"
      >
        <template #description>
          <span>We provide beautiful & minimal ready to use email templates. You can use Vue component &  Tailwind to build custom email templates.</span>
        </template>
      </LandingFeature>

      <!-- SEO Features -->
      <LandingFeature
        title="SEO Ready"
        :features="seoFeatures"
      >
        <template #description>
          <span>SEO is crucial for staying ahead in the game. We configured </span>
          <ULink
            to="https://nuxtseo.com/"
            target="_blank"
            class="underline"
          >
            <span>Nuxt SEO</span>
          </ULink>
          <span> module to help you rank on the first page.</span>
        </template>
      </LandingFeature>
    </div>

    <!-- Tech Stack -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <LandingFeature
        title="Robust Tech Stack"
        :features="techStackFeatures"
      />

      <div class="w-full h-[400px]">
        <UColorModeImage
          light="/images/landing/tech-stack.svg"
          dark="/images/landing/tech-stack-dark.svg"
          alt="Sign in page"
          class="size-full object-cover object-center"
        />
      </div>
    </div>
  </div>
</template>
