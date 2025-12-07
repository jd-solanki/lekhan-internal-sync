<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const items: AccordionItem[] = [
  {
    label: 'Can I try it before purchase?',
    content: 'Yes, You can checkout live demo, go through documentation on how it works & watch demo videos.',
  },
  {
    label: 'Can you explain the license, including what to do & what not to do?',
    slot: 'license',
  },
  {
    label: 'What I\'ll get after purchase?',
    slot: 'after-purchase',
  },
  {
    label: 'How can I download my invoice?',
    slot: 'invoice',
  },
  {
    label: 'What is covered under support?',
    slot: 'support',
  },
  {
    label: 'Why should I choose LaunchDayOne over other boilerplates?',
    slot: 'why-choose',
  },
  {
    label: 'Can I get a refund?',
    content: 'As this is a digital product & access is granted immediately after purchase, refunds cannot be provided. If you have any doubts or questions about the product, feel free to ask including for coding examples or a product demo. If you encounter any bugs or issue, please report them and we will resolve the issue promptly. If you experience any difficulty using the product, let us know and we\'ll be happy to assist you.',
  },
  {
    label: 'How can I get access to the repository?',
    content: 'On successful purchase, you\'ll immediately receive an invite for GitHub repo access. Do accept it before it expires.',
  },
  {
    label: 'How can I start my project after purchasing LaunchDayOne?',
    content: 'After purchase, You\'ll receive access to our private repo which you can fork in your own GitHub account and start modifying the code.',
  },
  {
    label: 'How & Where to deploy my project?',
    content: 'As this is Nuxt boilerplate, All platforms supported by nuxt including edge deployment is available to you. You can follow platform provider docs to deploy your app.',
  },
  {
    label: 'Can I use LauchDayOne to build a client project or commercially?',
    content: 'Yes, You\'re free to build projects for your client or lauch your own SaaS using LaunchDayOne. Just ensure it\'s not against the license like publishing it publically and all.',
  },
  {
    label: 'Is the codebase being maintained regularly?',
    content: 'Yes. Since we use LaunchDayOne for our own projects, we regularly update the codebase & libraries including security updates.',
  },
  {
    label: 'I\'m a beginner in Vue/Nuxt. Can I use it?',
    content: 'LaunchDayOne is beginner friendly boilerplate. Its comprehensive documentation, support & codebase will help you learn quickly and launch your project faster. Feel free to reach out to us, We\'ll love to help you over there. However, I strongly recommend you atleast know web development basics like HTML, CSS, JS, etc.',
  },
  {
    label: 'Is codebase in JavaScript or TypeScript?',
    content: 'LauchDayOne is TypeScript based project to help you catch errors before you encounter them at runtime.',
  },
  {
    label: 'Why should I use LaunchDayOne instead of AI tools like Lovable or Bolt?',
    slot: 'ai-tools',
  },
]
</script>

<template>
  <section class="py-16 lg:py-24">
    <div class="container">
      <LandingHeading
        title="FAQs"
        class="text-center"
      />

      <div class="max-w-3xl mx-auto">
        <UAccordion
          type="multiple"
          :items="items"
        >
          <template #license>
            <div class="pb-3.5 text-sm space-y-4">
              <div>
                <p class="font-medium mb-2">
                  What you can:
                </p>
                <ul class="list-disc list-inside space-y-1 text-muted">
                  <li>You're free to modify and build your projects using it</li>
                  <li>You can use our boilerplate for building unlimited personal, academic & commercial projects.</li>
                  <li>Build SaaS application where you charge users</li>
                </ul>
              </div>

              <div>
                <p class="font-medium mb-2">
                  What you can't:
                </p>
                <ul class="list-disc list-inside space-y-1 text-muted">
                  <li>You can't upload source code or any reward/benefit publicly.</li>
                  <li>You can't resell or redistribute it</li>
                  <li>You can't build opensource projects using it</li>
                </ul>
              </div>
            </div>
          </template>

          <template #after-purchase>
            <div class="pb-3.5 text-sm">
              <ul class="list-disc list-inside space-y-1 text-muted">
                <li>Acces to private GitHub repository</li>
                <li>Discord invite for support & community access</li>
                <li>SaaS cheatsheet</li>
                <li>License Key</li>
              </ul>
            </div>
          </template>

          <template #invoice>
            <div class="pb-3.5 text-sm">
              <ol class="list-decimal list-inside space-y-1 text-muted">
                <li>You can sign in to polar customer portal</li>
                <li>Choose your order</li>
                <li>Click on download invoice button</li>
              </ol>
            </div>
          </template>

          <template #support>
            <div class="pb-3.5 text-sm space-y-4">
              <div>
                <p class="font-medium mb-2">
                  What is covered?
                </p>
                <ul class="list-disc list-inside space-y-1 text-muted">
                  <li>Setup & Configuration</li>
                  <li>Understanding codebase & how everything is wired</li>
                  <li>How X is implemented or how to extend it</li>
                </ul>
              </div>

              <div>
                <p class="font-medium mb-2">
                  What is not covered?
                </p>
                <ul class="list-disc list-inside space-y-1 text-muted">
                  <li>Helping with your own business logic</li>
                  <li>Implementing a custom feature</li>
                </ul>
              </div>
            </div>
          </template>

          <template #why-choose>
            <div class="pb-3.5 text-sm space-y-3">
              <ul class="list-disc list-inside space-y-2 text-muted">
                <li>It's production ready and crafted with care & details. As an example, other boilerplates form validation messages are generic & default provided validation library (e.g. "Field required" for all required fields) however as I built it for my future products you'll notice each form field has user friendly messages like "Email is required".</li>
                <li>LaunchDayOne is built by developer having six years of experience in Vue so you can expect LaunchDayOne will be secure, optimized, organised & well thought. For example, LaunchDayOne have pre-commit hooks that won't let you push bad code, stops you from writing bad code with linting rules, industry standard naming conventions, best practices & many more.</li>
                <li>No bloatware & negligible third-party libraries.</li>
                <li>Tech stack that helps you ship faster</li>
              </ul>

              <p class="text-muted">
                If even if it's not convincing drop a feedback. We're always eager to improve.
              </p>
            </div>
          </template>

          <template #ai-tools>
            <div class="pb-3.5 text-sm space-y-3">
              <p class="text-muted">
                LaunchDayOne is hand crafted boilerplate that is perfectly engineered & well thought. We have taken care of UX, Security, Scalability, Optimization and all. AI tools like lovable or bolt are good for landing pages and very small 2-3 pages app. As you grow you might encounter errors and unexpected runtime behaviour of app. They won't help you ship your entire SaaS. Have a look at these links:
              </p>

              <ul class="list-disc list-inside space-y-1 text-muted">
                <li>
                  <a
                    href="https://x.com/leojr94_/status/1901560276488511759"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline"
                  >X Post</a>
                </li>
                <li>
                  <a
                    href="https://x.com/forgebitz/status/1963196184077516839"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline"
                  >X Post</a>
                </li>
                <li>
                  <a
                    href="https://x.com/leojr94_/status/1902537756674318347"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline"
                  >X Post</a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/vibecoding/comments/1mfgeex/vibe_coding_is_not_working_and_heres_why/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline"
                  >Reddit Post</a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/cursor/comments/1inoryp/cursor_fck_up_my_4_months_of_works/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline"
                  >Reddit Post</a>
                </li>
                <li class="text-muted">
                  & more
                </li>
              </ul>
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
  </section>
</template>
