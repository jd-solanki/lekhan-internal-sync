---
name: UI
description: Skills related to user interface design and development, including front-end frameworks, responsive design, and user experience principles.
---

- Always use Nuxt UI MCP to fetch component documentation before using it
- Don't use custom CSS classes unless necessary. Most importantly text colors, font sizes, spacing, border, layout, etc.
- Reuse tokens we have in Nuxt UI like colors, spacing, font sizes, etc. E.g. text-muted instead of gray color from tailwind.
- NEVER use custom color classes and refer to CSS available CSS Variables at <https://ui.nuxt.com/docs/getting-started/theme/css-variables>.
- Ensure responsiveness using Tailwind's responsive utilities (e.g., `sm:`, `md:`, `lg:`, `xl:`). Do take care of font sizes, spacing, and layout adjustments across different screen sizes.
- Follow accessibility best practices. Use semantic HTML elements, ARIA attributes where necessary.
- Don't overuse flex. Instead of `flex flex-col gap-6` prefer `space-y-6` unless you need specific flex behavior.
- Prefer grid layout over flex when possible.
