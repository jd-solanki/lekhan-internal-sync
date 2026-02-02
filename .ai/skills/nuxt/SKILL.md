---
name: Nuxt
description: Skills related to Nuxt.js framework
---

- Always use Nuxt MCP to query whatever information you need to work with
- Never create custom pending/loading or error states instead use `useAsyncData` to get pending & error state or alternatively if only loading state is needed use `useWithLoading` composable.
- prefer `throw createError` over returning error objects
