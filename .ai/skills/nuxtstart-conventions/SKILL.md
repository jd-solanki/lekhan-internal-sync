---
name: nuxtstart-conventions
description: Conventions and best practices for writing NuxtStart nuxt starter kit based project, including project structure, configuration
---

## App/Frontend Context

- When creating new page, break large page into smaller components. Place components inside `app/components/page/<page>/<component>.vue` and render without import in page as `Page<Page><Component>`. If inside layer, place in layer's app directory.


## API Design

- List response should be paginated and sortable
  - Extends or use `paginationSchema` for query validation
  - Response pattern: `{ data: [ ... ], total: <number> }`
- Don't just rely on frontend for validation; validate all inputs, constraints & edge cases on server-side as well.

## Frontend Consumption

- Get server API response type via following:

```ts
import type { InternalApi } from 'nitropack'

type OrdersListResponse = InternalApi['/api/polar/orders']['get']['orders']
```

## Error Handling

- On server when notifying admin about unexpected error:
  - Send pretty JSON with timestamp
  - Add enough context to identify issue like error, payload, user id, action, etc.

        ```ts
        const runtimeConfig = useRuntimeConfig()
        const errorTitle = '' // Write descriptive title of the error context

        await sendEmailToAdmins({
            subject: `[${runtimeConfig.public.app.name}] ${errorTitle}`,
            text: JSON.stringify({
                timestamp: new Date().toISOString(),
                error: result.error,
                payload: rawData,
            }, null, 2),
        })
