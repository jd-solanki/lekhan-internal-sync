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
  'https://placehold.co/552x340',
  'https://placehold.co/552x340',
  'https://placehold.co/552x340',
]
</script>

<template>
  <div class="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24 py-12 lg:py-24 overflow-hidden">
    <!-- Left Content -->
    <div class="flex flex-col gap-8 lg:gap-14 w-full lg:w-1/2">
      <div class="flex flex-col gap-4 lg:gap-6">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight lg:leading-[58px] text-highlighted">
          Production ready Nuxt boilerplate that helps you launch in weekend
        </h1>
        <p class="text-base lg:text-lg text-gray-600 dark:text-gray-400">
          Best Nuxt boilerplate that covers auth, payments, emails, SEO and more. Save months of work and launch faster than your competitors.
        </p>

        <div class="flex items-center gap-3">
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
            <div class="flex text-yellow-400">
              <UIcon
                v-for="i in 5"
                :key="i"
                name="i-heroicons-star-solid"
                class="w-4 h-4"
              />
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
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
    <div class="relative w-full lg:w-1/2 flex justify-center items-center">
      <!-- Mobile Carousel -->
      <UCarousel
        v-slot="{ item }"
        class-names
        :items="carouselImages"
        :ui="{ item: 'basis-[70%]' }"
        class="lg:hidden w-full"
        auto-height
        loop
        :autoplay="{ delay: 2000 }"
      >
        <img
          :src="item"
          width="264"
          height="264"
          class="rounded-lg"
        >
      </UCarousel>

      <!-- Desktop Vertical Carousel -->
      <div
        class="hidden lg:block relative w-full mx-auto mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      >
        <!-- INFO: 356px => 340px (img height) + 16px (img padding) -->
        <UCarousel
          v-slot="{ item }"
          orientation="vertical"
          loop
          :ui="{ container: 'h-[600px]', item: 'basis-[60%]' }"
          :items="carouselImages"
          class="w-full"
        >
          <img
            :src="item"
            height="340"
            class="rounded-lg"
          >
        </UCarousel>
      </div>
    </div>
  </div>
</template>
