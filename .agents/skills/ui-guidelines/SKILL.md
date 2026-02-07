---
name: ui-guidelines
description: How to correctly use Nuxt UI components and design system to build UI
---

- Always use Nuxt UI MCP to fetch component documentation before using it
- Never use custom CSS color classes unless in special cases. Most importantly text colors, font sizes, spacing, border, layout, etc.
- Reuse tokens we have in Nuxt UI like colors, spacing, font sizes, etc. E.g. text-muted instead of gray color from tailwind.
- NEVER use custom color classes and refer to CSS available CSS Variables at <https://ui.nuxt.com/docs/getting-started/theme/css-variables>.
- Ensure responsiveness using Tailwind's responsive utilities (e.g., `sm:`, `md:`, `lg:`, `xl:`). Do take care of font sizes, spacing, and layout adjustments across different screen sizes.
- Follow accessibility best practices. Use semantic HTML elements, ARIA attributes where necessary.
- Don't overuse flex. Instead of `flex flex-col gap-6` prefer `space-y-6` unless you need specific flex behavior.
- Prefer grid layout over flex when possible.

## Design System

- Use TailwindCSS design system. Additional configuration can be found at `app/assets/css/tailwind.css` in project
- Nuxt UI uses semantic naming for colors

    | Color | Default | Description |
    | --- | --- | --- |
    | `primary` | `green` | Main CTAs, active navigation, brand elements, important links |
    | `secondary` | `blue` | Secondary buttons, alternative actions, complementary UI elements |
    | `success` | `green` | Success messages, completed states, positive confirmations |
    | `info` | `blue` | Info alerts, tooltips, help text, neutral notifications |
    | `warning` | `yellow` | Warning messages, pending states, attention-needed items |
    | `error` | `red` | Error messages, validation errors, destructive actions |
    | `neutral` | `slate` | Text, borders, backgrounds, disabled states |

These semantic colors are available in the color prop of Nuxt UI components

- Nuxt UI provides Tailwind CSS utility classes for each semantic color you define, allowing you to use class names like text-error or bg-success

  ```vue
  <template>
    <!-- Semantic Color -->
    <span class="text-primary">Primary</span>
    <div class="bg-secondary">Secondary</div>

    <!-- Semantic based Text Colors -->
    <span class="text-dimmed">Dimmed</span>
    <span class="text-muted">Muted</span>
    <span class="text-toned">Toned</span>
    <span class="text-default">Text</span>
    <span class="text-highlighted">Highlighted</span>
    <span class="text-inverted bg-inverted">Inverted</span>

    <!-- For background -->
    <div class="bg-default">Default</div>
    <div class="bg-muted">Muted</div>
    <div class="bg-elevated">Elevated</div>
    <div class="bg-accented">Accented</div>
    <div class="bg-inverted text-inverted">Inverted</div>

    <!-- For Border -->
    <div class="border border-default">Default</div>
    <div class="border border-muted">Muted</div>
    <div class="border border-accented">Accented</div>
    <div class="border border-inverted">Inverted</div>
  </template>
  ```
