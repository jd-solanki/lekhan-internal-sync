---
name: Nuxt
description: Skills related to Nuxt.js framework
---

- Always use Nuxt MCP to query whatever information you need to work with
- Never create custom pending or error states instead use `useAsyncData` to get pending & error state. You can also utilize `immediate: false` to delay the fetch until you want to trigger it.
- prefer `throw createError` over returning error objects
