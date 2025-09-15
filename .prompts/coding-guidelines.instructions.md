# Coding Guidelines

## General Guidelines

- Always add comments to your code, explaining the purpose of each function and complex logic. It related add examples of usage.
- Don't reinvent the wheel, use existing libraries and frameworks to solve problems. E.g.
  - `$fetch` already provides pending and error states, so you don't need to implement them yourself.
  - We can use various `VueUse` composables to simplify our code.

### Security

- Sanitize user input on both client & server.
- Validate API inputs and protect private routes.
- Escape HTML to prevent XSS.
- Use HttpOnly cookies for auth.

## Vue.js

### Composition API & TypeScript

- Use `<script setup lang="ts">` and Composition API.
- Always use TypeScript for type safety.
- Organize logic via composables in `app/composables/` (auto-imported).

### Validation & Schemas

- Use Zod v4 for validation schemas. With Zod v4, use ternary operator to provide better error messages: `z.email({ error: e => !e.input ? 'Email is required' : 'Invalid email address' })`.
- Never duplicate validation schemas between client and server. Keep shared schemas in `shared/schemas/` directory if they need to be used on both sides.
- Always check for existing schemas in `shared/schemas/` before creating new ones.
- Shared schemas from `shared/schemas/` are auto-imported by Nuxt, no manual import required.

### 🎨 Styling

- We use NuxtUI for UI components which uses tailwind 4 for styling.
- Always prefer writing tailwind 4 classes instead of writing custom CSS and style block.
- Use `assets/` for preprocessed files, `public/` for direct.

## Nuxt.js

### Directory Structure

> _As we're using Nuxt.js, the directory structure follows its conventions._

- We're using Nuxt 4 so the directory structure is based on Nuxt 4 conventions. `/app/` directory is used for all app-related code and `/server/` for API & backend logic.
- Ignore `.nuxt/` and `.output/` in git.
- Nuxt enforces auto-imports and we also prefer the same

### Components

- When using `UButton` if it's Async operation add `loading-auto` to it.
- If extracting page specific components, place them in `app/components/pages/`. E.g. For `app/pages/dashboard.vue`, place components in `app/components/pages/dashboard/`.

### Data Fetching

- Use `useFetch()` or `useAsyncData()` for SSR-safe fetching. E.g. Fetching data from an API:

  ```ts
  const { data, error, isPending } = await useFetch('/api/data')
  ```

- Use `$fetch()` for client-side-only requests. E.g. Making post, requests:

  ```ts
  const { data, error } = await $fetch('/api/data', {
    method: 'POST',
    body: { key: 'value' }
  })

### Auto Imports

- Only import components from `#components` when component is dynamically used in `<script>` block.
- No need to import component if it's used in `<template>` block

### Server

#### APIs

- Place server routes in `server/api/` using `defineEventHandler()`.
- Always validate query, params, and body in server routes via `getValidatedQuery()`, `getValidatedRouterParams()`, and `readValidatedBody()`.
- Always try to look for existing schemas in `shared/schemas/` directory for zod schemas & types of API request, response and data. Ensure both client and server are connected to the same schema.

##### Conventions & Best Practices

- Always follow the RESTful API conventions when creating new API routes.
- Always have separate delete endpoint to delete a resource even for soft delete where you just set is_deleted flag to true.
- Never allow PATCH to delete resource.
- Send 204 to already deleted resource without raising exception of resource already deleted ( Idempotency principles).
- API endpoint should be resource not action

    ```diff
    + https://api.example.com/tasks

    - https://api.example.com/get-tasks
    ```

- Collection name should be plural

    ```diff
    + https://api.example.com/tasks
    + https://api.example.com/tasks/{task_id}

    - https://api.example.com/task
    - https://api.example.com/task/{task_id}
    ```

- Entity CRUD endpoints conventions

```shell
GET    /tasks           # Get all tasks
POST   /tasks           # Create new task
GET    /tasks/{taskId} # Get task by id
PUT    /tasks/{taskId} # Update task by id (Replace)
PATCH  /tasks/{taskId} # Partial update task by id
DELETE /tasks/{taskId} # Delete task by id

POST   /tasks/batch     # Create multiple tasks

GET    /tasks/{taskId}/comments  # Get all comments for task
POST   /tasks/{taskId}/comments  # Create new comment for task
GET    /comments/{comment_id}     # Get comment by id for task
PUT    /comments/{comment_id}     # Update comment by id for task
PATCH  /comments/{comment_id}     # Partial update comment by id for task
DELETE /comments/{comment_id}     # Delete comment by id for task
```

- Don't go deeper than 3 levels: `collection/resource/collection`

    ```diff
    + https://api.example.com/tasks/1/comments
    - https://api.example.com/tasks/1/comments/1/replies
    ```

- API response should be generic and agnostic
  - Even if you are building API for a specific client, make sure your API response is generic and agnostic
  - Don't return client specific data in response. Doing so will make your API tightly coupled with the client and requires changing both client and server code whenever requirement changes.
  - E.g. For chat page, instead of single endpoint for chat details, chat messages, meta data, etc. create separate endpoints for each of them.

- Instead of returning list return object with name for making your response future proof

    ```json
    {
      "tasks": [
        { "id": 1, "title": "Buy Tomato", "is_completed": false },
        { "id": 2, "title": "Learn Sanskrit", "is_completed": false }
      ],
      "meta": {
        "total": 2
      }
    }
    ```

### Routing & Navigation

- Use `app/pages/` for routes.
- Use `<ULink>` for navigation.
- Read `index.d.ts`, `PageMeta` interface for additional meta we can use for route.

### Testing

- Use `@nuxt/test-utils` for unit/E2E tests.
- Use Vitest with Nuxt environment.
- Place tests alongside source or in `tests/`.
- Prefer mock services and composable testing.

### Error Handling

- Use `app/error.vue` for global errors.
- Use `createError()` in server handlers.
- Show toast via `useToastMessage` composable to display errors.

  ```ts
  await $fetch('/api/endpoint', {
    method: 'POST',
  }).catch((error) => {
    errorToast({
      title: 'Error ...',
      description: error.data.message || 'An error occurred while ...',
    })
  })

## Pinia

- Use the name of the store and surround it with `use` as the return value of `defineStore()`. E.g. For "user" store, use `defineStore('user', { ... })` and export it as `useUserStore`.

    ```ts
    export const useUserStore = defineStore('user', {})
    ```

- When using pinia store, prefer using `const  <storeName> = use<StoreName>Store()` syntax. E.g. For "user" store, use `const userStore = useUserStore()`.
- Always use setup stores instead of options stores. In Setup Stores:
  - `ref()`s become state properties
  - `computed()`s become getters
  - `function()`s become actions

## Database

### Tables

- Check `/server/db/schemas/index.ts` for existing tables and their schemas.
- When creating a new database table, follow these steps:
    1. Create new database/drizzle table, We create a new file in `server/db/schemas/tables` directory and import it in `server/db/schemas/tables/index.ts` file. E.g. If table is `users`, we create a file `server/db/schemas/tables/users.ts` and import it in `server/db/schemas/tables/index.ts` file.
    2. Create schema file in `shared/schemas/db` directory. E.g. If table is `users`, we create a file `shared/schemas/db/users.ts`.
    3. Ensure we're not recreating columns for which we already have mixins in `server/db/schemas/mixins.ts`.

- When defining the table, Always add cascade value to foreign keys.
- Use transactions for multiple database operations that depends on each other to ensure atomicity. E.g. Adding new user in `users` table and creating a new account in `accounts` table.
- Use Drizzle's high-level APIs (like `db.query.tableName.findMany()`, `db.query.tableName.findFirst()`) in your API routes for better type safety and readability.
- Only write CRUD util if same query is written in multiple places or else Prefer using Drizzle's high-level APIs directly in API routes.
- zod schemas for database tables should be placed in `shared/schemas/db` directory so that they can be used in both client and server code.

## Drizzle

- Prefer using SQL like syntax for drizzle-orm queries.

## Nuxt UI

- Always read the latest documentation for the Nuxt UI components you are using by using the fetch tool.
- Don't use custom slot if not needed. Only use custom slot when you need to pass a component or a complex structure.
- We already have set of instructions for using Nuxt UI at `.prompts/nuxt-ui.md` file. Please refer to that file.

## Authentication

- To get current user session, instead of `const { user } = await getUserSession(event)` composable from `nuxt-auth-utils`, use `const userStore = useUserStore()`.
