<script setup lang="ts">
/**
 * Landing page features section showcasing Authentication capabilities
 * Two-column layout: feature details on left, preview image on right
 */

const features = [
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
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-16 items-center justify-center">
    <!-- Feature Details -->
    <div class="flex-1 flex flex-col gap-10 w-full">
      <!-- Header -->
      <div class="flex flex-col gap-4">
        <h2 class="font-['Kalam'] font-bold text-4xl leading-10 text-highlighted">
          Authentication
        </h2>
        <p class="text-base text-muted leading-6">
          You're falling behind while others launch SaaS apps in a weekend. That's why LaunchDayOne exists to give indie hackers, full‑stack devs, freelancers, and startups the exact stack they need to ship fast.
        </p>
      </div>

      <!-- Feature List -->
      <div class="flex flex-col gap-6">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex gap-3 items-center"
        >
          <UIcon
            :name="feature.icon"
            class="size-6 text-gray-900 dark:text-white shrink-0"
          />
          <p class="text-base text-toned font-semibold">
            {{ feature.label }}
          </p>
          <UBadge
            v-if="feature.badge"
            :label="feature.badge"
            color="info"
            variant="subtle"
            size="xs"
          />
        </div>
      </div>
    </div>

    <!-- Feature Image -->
    <div class="flex-1 w-full min-h-[370px] bg-linear-to-b from-gray-500/50 to-gray-100/10 dark:from-gray-500/50 dark:to-gray-900/10 border border-gray-200/20 dark:border-gray-800/20 rounded-[calc(var(--ui-radius)*2)] p-2">
      <div class="w-full h-[370px] rounded-[calc(var(--ui-radius)*2)] overflow-hidden">
        <img
          src="/images/landing/auth-feature.png"
          alt="Authentication dashboard preview"
          class="w-full h-full object-cover object-top-left"
        >
      </div>
    </div>
  </div>
</template>
