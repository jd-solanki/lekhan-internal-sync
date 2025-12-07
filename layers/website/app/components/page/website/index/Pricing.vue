<script lang="ts" setup>
</script>

<template>
  <div>
    <h3 class="font-['Kalam'] font-bold text-4xl text-highlighted mb-6">
      Pricing
    </h3>
    <div class="grid grid-cols-2 gap-16">
      <div>
        <div class="space-y-2">
          <p>It's just <span class="font-mono">$89</span>.</p>
          <p>You can earn it back easily but not the time you waste building from scratch</p>
        </div>
        <p class="my-6">
          It's not just about boilerplate, You'll get perfectly engineered product based on foundations of six years of experience & hard earned lessons.
        </p>
        <div class="space-y-2 mb-8">
          <p>Why worry when it's recommended by 200+ developers</p>
          <p>...</p>
        </div>
        <div class="space-y-4">
          <p>We'll be transparent with upcoming pricing, Here's what future holds.</p>
          <UTimeline
            orientation="horizontal"
            :default-value="0"
            size="3xs"
            :items="[
              { description: '$89' },
              { description: '$129' },
              { description: '$149' },
            ]"
            class="w-full font-mono"
          />
        </div>
      </div>
      <PaymentPlan />
    </div>
  </div>
</template>
