---
name: nuxt
description: Skills related to Nuxt.js framework
---

- Always use Nuxt MCP to query whatever information you need to work with
- Never create custom pending/loading or error states instead use `useAsyncData` to get pending & error state or alternatively if only loading state is needed use `useWithLoading` composable.
- prefer `throw createError` over returning error objects
- When creating new page, break large page into smaller components. Place components inside `app/components/page/<page>/<component>.vue` and render without import in page as `Page<Page><Component>`. If inside layer, place in layer's app directory.
