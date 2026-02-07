---
name: nuxt-nitro-api
description: How to design and develop APIs, including authentication, best practices, etc for scalability and security.
---

- Use h3 validation utils:
  - query with `getValidatedQuery`
  - params with `getValidatedRouterParams.`
  - body with `readValidatedBody`

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
