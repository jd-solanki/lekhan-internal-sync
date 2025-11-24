<script setup lang="ts">
const avatars = [
  'https://i.pravatar.cc/150?u=1',
  'https://i.pravatar.cc/150?u=2',
  'https://i.pravatar.cc/150?u=3',
  'https://i.pravatar.cc/150?u=4',
  'https://i.pravatar.cc/150?u=5',
  'https://i.pravatar.cc/150?u=6',
]

const carouselImages = [
  { light: '/images/landing/users-page-ss.png', dark: '/images/landing/users-page-ss-dark.png' },
  { light: '/images/landing/command-palette.png', dark: '/images/landing/command-palette-dark.png' },
  { light: '/images/landing/billing-page-ss.png', dark: '/images/landing/billing-page-ss-dark.png' },
  { light: '/images/landing/account-settings-security-ss.png', dark: '/images/landing/account-settings-security-ss-dark.png' },
  { light: '/images/landing/sign-in.png', dark: '/images/landing/sign-in-dark.png' },
]
</script>

<template>
  <div class="relative flex flex-col xl:flex-row items-center gap-12 lg:gap-12 overflow-hidden">
    <!-- Left Content -->
    <div class="flex flex-col gap-8 lg:gap-10 w-full xl:w-1/2 max-xl:text-center md:py-24 py-12 max-xl:items-center">
      <div class="flex flex-col gap-4 lg:gap-6 max-xl:max-w-3xl text-balance">
        <h1 class="text-4xl sm:text-4xl lg:text-5xl font-bold leading-tight lg:leading-[58px] text-highlighted">
          Bloat-free, Modular, Layer Focused, Best Nuxt Boilerplate
        </h1>
        <h2 class="sm:text-base lg:text-lg text-muted">
          The best Nuxt boilerplate that provides auth, payments, emails, SEO and more. Save months of work and launch faster than your competitors.
        </h2>

        <div class="flex items-center max-xl:justify-center gap-3">
          <UAvatarGroup
            size="sm"
            :max="6"
          >
            <UAvatar
              v-for="(src, index) in avatars"
              :key="index"
              :src="src"
              alt="Avatar"
            />
          </UAvatarGroup>

          <div class="flex flex-col gap-1">
            <div class="flex text-warning">
              <UIcon
                v-for="i in 5"
                :key="i"
                name="i-heroicons-star-solid"
                class="size-4"
              />
            </div>
            <p class="text-sm text-muted">
              200+ makers love us
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          size="lg"
          label="Reserve Your Spot at $89"
        />
        <UButton
          variant="outline"
          color="neutral"
          size="lg"
          label="View Demo"
          to="/app"
        />
      </div>
    </div>

    <!-- Right Content (Images) -->
    <div class="relative w-full xl:w-1/2 flex justify-center items-center xl:rotate-x-50 xl:rotate-z-15">
      <!-- Mobile Carousel -->
      <UCarousel
        v-slot="{ item }"
        class-names
        :items="carouselImages"
        :ui="{ item: 'lg:basis-[50%] md:basis-[60%] basis-[80%]' }"
        class="xl:hidden w-full"
        loop
        :autoplay="{ delay: 2000 }"
      >
        <UColorModeImage
          :light="item.light"
          :dark="item.dark"
          class="rounded-lg size-full"
        />
      </UCarousel>

      <!-- Desktop Vertical Carousel -->
      <div
        class="hidden xl:block relative w-full mx-auto mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      >
        <!-- INFO: 356px => 340px (img height) + 16px (img padding) -->
        <UCarousel
          v-slot="{ item }"
          orientation="vertical"
          loop
          auto-scroll
          :ui="{ container: 'h-[800px]', item: 'basis-[70%]' }"
          :items="carouselImages"
          class="w-full"
        >
          <UColorModeImage
            :light="item.light"
            :dark="item.dark"
            class="rounded-lg"
            width="600"
          />
        </UCarousel>
      </div>
    </div>
  </div>
</template>
