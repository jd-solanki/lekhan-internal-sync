<script lang="ts" setup>
import type { AccordionItem } from '@nuxt/ui'

definePageMeta({
  layout: 'website',
})

const paymentsStore = usePaymentsStore()

// Tech brands recognizable to developer audience
const companies = [
  { name: 'GitHub', icon: 'i-simple-icons-github' },
  { name: 'Vercel', icon: 'i-simple-icons-vercel' },
  { name: 'Stripe', icon: 'i-simple-icons-stripe' },
  { name: 'Notion', icon: 'i-simple-icons-notion' },
  { name: 'Linear', icon: 'i-simple-icons-linear' },
  { name: 'Figma', icon: 'i-simple-icons-figma' },
  { name: 'Supabase', icon: 'i-simple-icons-supabase' },
  { name: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss' },
]

// Lekhan-specific value propositions
const features = [
  {
    icon: 'i-lucide-pen-line',
    title: 'Simple to Use',
    description: 'Open Lekhan and start writing. No complex menus, no setup, just a clean editor.',
  },
  {
    icon: 'i-lucide-folder-sync',
    title: 'Auto Organize',
    description: 'Notes are automatically organised in sidebar collections. No manual folders needed',
  },
  {
    icon: 'i-lucide-search',
    title: 'Quick Navigation',
    description: 'Quickly jump between notes without losing your flow using keyboard first command palette.',
  },
  {
    icon: 'i-lucide-lock',
    title: 'Private by Default',
    description: 'Your notes are yours alone. All content is yours, we never read your notes.',
  },
]

const testimonials = [
  {
    name: 'Ayesha Doe',
    role: 'Product Designer',
    avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=female-1',
    quote: 'Lekhan replaced five different apps for me. Writing, outlining, journaling – it handles everything without getting in the way.',
  },
  {
    name: 'Tom Chen',
    role: 'Software Engineer',
    avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=male-1',
    quote: 'The auto-organize feature is genuinely magical. My note chaos is gone. I can finally find things when I need them.',
  },
  {
    name: 'Sara Müller',
    role: 'Technical Writer',
    avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=female-2',
    quote: 'Clean, fast, and distraction-free. Exactly what a writing tool should be. I take my best notes in Lekhan.',
  },
  {
    name: 'James Park',
    role: 'Startup Founder',
    avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=male-2',
    quote: 'I use Lekhan for everything — meeting notes, ideas, docs. Instant search means I stop losing context between calls.',
  },
  {
    name: 'Priya Nair',
    role: 'Researcher',
    avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=female-3',
    quote: 'Finally a notes app that respects my privacy. Knowing my notes are private gives me real peace of mind.',
  },
  {
    name: 'Lucas Ferreira',
    role: 'Freelance Developer',
    avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=male-3',
    quote: 'Switched from Notion and never looked back. Lekhan is fast, minimal, and just works.',
  },
]

const faqItems: AccordionItem[] = [
  {
    label: 'Is Lekhan free to start?',
    content: 'Yes. Lekhan has a 7-day free trial. Upgrade anytime for more notes.',
  },
  {
    label: 'Can I access my notes on any device?',
    content: 'Absolutely. Lekhan is web-based and works on any device with a modern browser. Mobile apps are on our roadmap.',
  },
  {
    label: 'How does auto-organize work?',
    content: 'Lekhan automatically adds notes to the sidebar for quick access as you create.',
  },
  {
    label: 'Is my data private and secure?',
    content: 'Yes. All notes are yours. We do not read your notes and never sell your data.',
  },
  {
    label: 'Can I import my existing notes?',
    content: 'We support Markdown import. If you have notes in Markdown-compatible apps (Obsidian, Notion export, etc.), you can import them right away.',
  },
  {
    label: 'What happens if I exceed my plan limits?',
    content: 'You will be notified before hitting a limit. Your existing notes remain safe, you just need to upgrade to add more.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      id="hero"
      class="relative overflow-hidden pt-16 pb-24"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center text-balance">
          <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            <div class="text-primary">
              Distraction Free
            </div> Notes for Clear Thinking
          </h1>

          <p class="mx-auto mb-10 max-w-2xl text-lg text-muted">
            Experience the minimalist note-taking app designed for thinkers who want to write without distractions
          </p>

          <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <UButton
              size="xl"
              to="/auth/sign-up"
              trailing-icon="i-lucide-arrow-right"
              class="px-5"
            >
              Start for Free
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              to="#pricing"
              class="px-5"
            >
              View Pricing
            </UButton>
          </div>
        </div>

        <!-- Hero image: light/dark variants from template -->
        <div class="mx-auto mt-16 max-w-5xl">
          <div class="relative rounded-xl border border-default bg-elevated shadow-2xl overflow-hidden">
            <UColorModeImage
              light="/images/landing/hero-light.png"
              dark="/images/landing/hero-dark.png"
              alt="Lekhan app preview"
              class="w-full object-cover"
            />
            <!-- Fade bottom so image blends into page -->
            <div class="absolute bottom-0 left-0 w-full h-24 bg-linear-to-b from-transparent to-default pointer-events-none" />
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted By companies -->
    <section class="py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm font-medium text-muted mb-8">
          Trusted by teams at
        </p>
        <div class="flex flex-wrap justify-center items-center gap-x-10 gap-y-5 opacity-60">
          <div
            v-for="company in companies"
            :key="company.name"
            class="flex items-center gap-2"
          >
            <UIcon
              :name="company.icon"
              class="size-5"
            />
            <span class="text-sm font-semibold">{{ company.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features: Built for thinkers -->
    <section
      id="features"
      class="py-24 bg-muted/50"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center mb-16">
          <UBadge
            variant="outline"
            class="mb-4"
          >
            Features
          </UBadge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Built for thinkers, not organizers
          </h2>
          <p class="text-lg text-muted">
            Everything you need to capture and organize your ideas.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <UCard
            v-for="feature in features"
            :key="feature.title"
          >
            <div class="flex flex-col items-center text-center gap-4 p-2">
              <div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <UIcon
                  :name="feature.icon"
                  class="size-6"
                />
              </div>
              <h3 class="font-semibold text-highlighted">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-muted">
                {{ feature.description }}
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Pricing: reuse existing PricingPlans component (store init'd by public middleware) -->
    <section
      id="pricing"
      class="py-24"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center mb-16">
          <UBadge
            variant="outline"
            class="mb-4"
          >
            Pricing
          </UBadge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, honest pricing
          </h2>
          <p class="text-lg text-muted">
            Start free, upgrade when you need more. No hidden fees.
          </p>
          <p class="mt-2 text-sm text-muted">
            All plans include a 7-day free trial.
          </p>
        </div>

        <PricingPlans
          :products="paymentsStore.recurringProducts"
          class="max-w-5xl mx-auto"
        />
      </div>
    </section>

    <!-- Testimonials -->
    <section
      id="testimonials"
      class="py-24 bg-muted/50"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center mb-16">
          <UBadge
            variant="outline"
            class="mb-4"
          >
            Testimonials
          </UBadge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Loved by writers and thinkers
          </h2>
          <p class="text-lg text-muted">
            From solo writers to growing teams — Lekhan keeps everyone in flow.
          </p>
        </div>

        <div class="columns-1 gap-6 md:columns-2 lg:columns-3">
          <UCard
            v-for="t in testimonials"
            :key="t.name"
            class="mb-6 break-inside-avoid"
          >
            <div class="flex items-start gap-4 p-2">
              <UAvatar
                :src="t.avatar"
                size="md"
              />
              <div>
                <p class="text-sm text-default mb-3">
                  {{ t.quote }}
                </p>
                <p class="text-sm font-semibold text-highlighted">
                  {{ t.name }}
                </p>
                <p class="text-xs text-muted">
                  {{ t.role }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section
      id="faq"
      class="py-24"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center mb-16">
          <UBadge
            variant="outline"
            class="mb-4"
          >
            FAQ
          </UBadge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-lg text-muted">
            Everything you need to know about Lekhan.
          </p>
        </div>

        <div class="max-w-3xl mx-auto">
          <UAccordion :items="faqItems" />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center text-balance">
          <h2 class="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
            Start writing clearly today
          </h2>
          <p class="text-lg text-muted mb-10">
            Join thousands of thinkers who use Lekhan to capture their best ideas - for free.
          </p>
          <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <UButton
              size="xl"
              to="/auth/sign-up"
              trailing-icon="i-lucide-arrow-right"
            >
              Get Started for Free
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              to="/auth/sign-in"
            >
              Sign In
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
