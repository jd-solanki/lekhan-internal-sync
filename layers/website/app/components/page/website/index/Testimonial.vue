<script setup lang="ts">
</script>

<template>
  <div class="py-24 mb-20 flex justify-center items-center">
    <div class="w-full flex justify-center items-center py-6">
      <div class="max-w-[1248px] w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 px-4 xl:px-0">
        <!-- Image -->
        <div class="w-full md:w-[360px] h-[360px] shrink-0 rounded-lg overflow-hidden">
          <img
            src="/images/landing/ajaybhai-and-vrushankbhai.png"
            alt="Testimonial"
            class="w-full mask-radial-farthest-side mask-radial-from-100% mask-radial-at-[30%_30%] h-full object-cover"
          >
        </div>

        <!-- Text Content -->
        <div class="w-full md:w-[824px] space-y-12">
          <div class="flex flex-col gap-6 items-start">
            <div class="opacity-10 w-10 h-10 text-black dark:text-white">
              <UIcon
                name="i-lucide-quote"
                class="w-full h-full"
              />
            </div>
            <p class="text-lg font-bold text-gray-900 dark:text-white leading-7 font-dm-sans">
              We tried it ourselves and it's very well engineered & easy to start working on core idea. As per our experience of building 10+ years we highly recommend this boilerplate to launch your next idea.
            </p>
          </div>
          <div class="space-y-2">
            <p>
              Ajay Patel & Vrushank Brahmakshatriya
            </p>
            <small>
              Founders of <ULink
                target="_blank"
                rel="noopener noreferrer"
                href="https://themeselection.com"
                class="underline decoration-solid"
              >
                ThemeSelection
              </ULink>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-dm-sans {
  font-family: 'DM Sans', sans-serif;
}
</style>
