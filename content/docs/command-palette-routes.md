# Auto-Scanned Routes in Command Palette

The command palette now automatically scans and includes all routes using the default layout, making them searchable without manual configuration.

## Features

- **Auto-discovery**: All routes using the default layout are automatically detected and added to the command palette
- **Smart filtering**: Only routes with the default layout are included
- **Admin routes**: Admin-only routes are only shown to admin users
- **Nested routes**: Handles nested routes with hierarchical labels (e.g., "Account Settings / Profile")
- **Customizable**: Routes can be customized with labels, icons, and visibility

## Route Metadata

You can customize how routes appear in the command palette using `definePageMeta`:

### Hide a route from search

```vue
<script setup>
definePageMeta({
  search: false
})
</script>
```

### Custom label and icon

```vue
<script setup>
definePageMeta({
  search: {
    label: 'User Profile',
    icon: 'i-lucide-user'
  }
})
</script>
```

### Admin-only routes

Admin routes are automatically filtered based on user role:

```vue
<script setup>
definePageMeta({
  isAdminOnly: true
})
</script>
```

## How it works

1. The `useSearchableRoutes` composable scans all routes from Vue Router
2. Only routes using the default layout are included (excludes auth pages with `layout: 'blank'`)
3. Routes are filtered based on metadata and user permissions
4. Labels are auto-generated from route paths or use custom `search.label`
5. Icons default to `i-lucide-file` or use custom `search.icon`
6. Routes are grouped in the command palette as Admin Pages or Pages

## Auto-excluded routes

The following types of routes are automatically excluded from search:

- Routes with `search: false`
- Routes using non-default layouts (e.g., `layout: 'blank'`)
- Dynamic routes (containing `:` in the path)
- Admin routes for non-admin users
- Routes without a name or path

## Label generation

If no `search.label` is provided, labels are auto-generated from the route path:

- `/app/billing` → "Billing"
- `/app/account-settings/profile` → "Account Settings / Profile"
- `/admin/users` → "Users"

Nested routes use "/" as separator to show hierarchy.

## Default icon

All routes use `i-lucide-file` as the default icon unless a custom `search.icon` is provided.

## Grouping

Routes are grouped in the command palette as:
- **Admin Pages**: Routes under `/admin` (only visible to admin users)
- **Pages**: All other routes using the default layout
