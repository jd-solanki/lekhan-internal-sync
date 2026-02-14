# Layouts Module

> _Provides application layout templates and UI infrastructure components that define consistent visual structure and navigation patterns across different application contexts._

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Provide 4 distinct layout templates for different application contexts (dashboard, documentation, website, blank)
- Render reusable layout components (headers, footers, navigation sidebars)
- Generate searchable route items for command palette integration
- Manage navigation menu structures with permission-aware display
- Define global layout styling and responsive patterns
- Supply page header components for consistent page titles across features

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

**Note on Domain Model**: This module has no database entities or persisted state. Its "domain" consists of runtime UI concepts and configuration structures that define layout behavior.

### Entities

#### Layout Template

**Meaning:** Named layout configuration that wraps page content with consistent visual structure (header, footer, sidebar, navigation)

**Lifecycle Rules:**

- Layout selected via page metadata in page component
- Layout components rendered once per page, persist across client-side navigation
- Layout determines page structure before page content renders
- No creation/deletion - layouts are static configuration

#### Navigation Item

**Meaning:** Single menu entry in navigation sidebar or dropdown representing a route or external link - includes label, icon, destination, and optional nesting for hierarchical menu structures.

**Lifecycle Rules:**

- Navigation items defined statically in configuration constants
- Filtered dynamically based on user role (admin vs regular)
- Rendered in sidebar (desktop) or mobile navbar
- Active state determined by current route match

#### Searchable Route

**Meaning:** Application route metadata enriched for command palette discoverability - represents a navigable page that users can quickly find and access via keyboard-driven search.

**Lifecycle Rules:**

- Auto-generated from Vue Router routes at runtime
- Filtered by layout type (only default layout routes included)
- Filtered by user role (admin routes hidden from non-admins)
- Excluded if route marked non-searchable or contains dynamic parameters
- Updated whenever router configuration changes
- Labels auto-generated from route paths or custom metadata

### Relationships

**Within Module:**

- **Layout Template** → **Navigation Items**: One-to-many (layouts display navigation menus)
  - **Meaning**: Each layout template includes zero or more navigation menus
  - **Integrity Rule**: Navigation items defined independently, layouts reference them via imports

- **Navigation Item** → **Navigation Item**: One-to-many (parent-child hierarchy)
  - **Meaning**: Navigation supports nested menu structures
  - **Integrity Rule**: Children inherit visibility rules from parents

**Cross-Module References:**

- **Layout Template** → **User** (Auth Module): Consumes user state via `useUserStore()`
  - **Integration Point**: Layouts read `user.name`, `user.email`, `user.image`, `isAdmin` for display and permission checks
  - **Contract**: Auth Module provides `useUserStore()` composable exposing reactive user state

- **Searchable Route** → **App Pages** (All Modules): Scans routes defined by all feature modules
  - **Integration Point**: Vue Router aggregates routes from all layers, layouts module scans them
  - **Contract**: Pages define `definePageMeta({ search: {...} })` to configure search behavior

- **Navigation Items** → **External Services**: Reference external URLs (Polar Customer Portal, Admin Dashboard)
  - **Integration Point**: Navigation can link to external services configured in environment
  - **Contract**: External URLs sourced from app config or environment variables

### Business Rules & Invariants

- **Layout exclusivity**: Each page has exactly one layout, defaults to `default` if not specified
- **Mobile responsiveness**: Desktop sidebar must collapse to mobile navbar on small screens (automatically managed by Nuxt UI dashboard components)
- **Permission enforcement**: Admin navigation items never displayed to non-admin users (filtered at runtime via `useUserStore().isAdmin`)
- **Search eligibility**: Only routes with `layout: 'default'` appear in command palette (other layouts excluded)
- **Dynamic route exclusion**: Routes with dynamic parameters (`:id`, `[id]`) automatically excluded from searchable routes (cannot be directly accessed without parameter)
- **Search icon requirement**: All searchable routes should have icon metadata (warning logged if missing)
- **User isolation**: User dropdown only shows current authenticated user's data
- **Navigation uniqueness**: Navigation item labels must be unique within each navigation group
- **Label generation**: Searchable route labels auto-generated from path segments if `meta.search.label` not provided (capitalized, slash-separated for nested routes)

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **Base Module**: For core utilities, composables, stores, and Nuxt UI configuration that layouts components consume

**Depended on by:**

- **Auth Module**: Auth pages use `blank` layout, admin pages use `default` layout with admin navigation
- **Blog Module**: Blog pages use `docs` layout with content navigation
- **Docs Module**: Documentation pages use `docs` layout with content tree
- **Payments Module**: Billing pages use `default` layout with sidebar navigation
- **Website Module**: Marketing pages use `website` layout for minimal public-facing chrome
- **All Application Pages**: Every page consumes one of the four layout templates

**Integration Contract:**

- Pages select layout via `definePageMeta({ layout: 'name' })` in component `<script setup>`
- Pages configure command palette search via `definePageMeta({ search: { label, icon } })` or `search: false`
- Pages customize main element styling via `definePageMeta({ mainClass: '...' })`
- Other modules can import navigation constants from `asideNavigation.ts` for custom navigation needs
- Layout components auto-import available globally (Nuxt auto-imports from `components/` directory)

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

**Core Interaction Principles:**

- **Context-appropriate chrome**: Layouts adapt UI chrome to context - full dashboard experience for authenticated users, minimal distraction for documentation reading, zero chrome for auth flows
- **Consistent navigation patterns**: Same navigation structure across all dashboard pages, predictable header/footer placement in docs/website layouts
- **Mobile-first responsive**: Layouts gracefully collapse sidebar to navbar on mobile, preserving all functionality in touch-friendly format
- **Permission-aware UI**: Navigation automatically hides admin-only items from regular users, eliminating confusion and privilege confusion
- **Keyboard-driven discovery**: Command palette (Cmd+K) provides fast keyboard access to all dashboard pages without memorizing URLs
- **Visual hierarchy**: Layout components establish clear visual zones (header, content, sidebar, footer) with consistent spacing and styling
- **Accessibility foundation**: Semantic HTML structure (header, main, aside, footer elements) provides screen reader navigation landmarks
- **Theme continuity**: All layouts respect user's color mode preference (light/dark) and apply theme consistently across components

**Page-Level Documentation:**

- Layouts module defines no pages - it provides templates consumed by pages in other modules
- Each module's pages documented in their respective `docs/modules/{module}/frontend/pages/` directories

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section._

**This module defines NO pages.** It provides layout templates that other modules' pages consume via `definePageMeta({ layout: 'name' })`.

**Layout URLs Pattern:**

Layouts do not have their own URLs. They wrap pages from other modules:

- **default** layout wraps: `/app/**`, `/admin/**` (dashboard and admin pages)
- **docs** layout wraps: `/docs/**`, `/blog/**` (documentation and blog content pages)
- **website** layout wraps: `/`, `/about`, `/privacy`, `/terms` (marketing and legal pages)
- **blank** layout wraps: `/auth/**`, landing pages (minimal chrome experiences)

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients._

**This module exposes NO API endpoints.** It is a frontend-only module providing UI components and layout templates.

The module exposes four layout templates (default, docs, website, blank) that wrap page content with consistent visual structure. It provides a reusable page header component for consistent page titles across features. Navigation constants define menu structures for dashboard, admin, and footer areas. A searchable route composable auto-generates command palette entries from the application's route configuration.

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Layout Template**: Named Vue component that wraps page content with consistent visual structure (header, footer, sidebar)
- **Layout Chrome**: Collective term for header, footer, sidebar, and navigation UI components surrounding main content
- **Command Palette**: Keyboard-driven search interface (Cmd+K) for quick page navigation, powered by Nuxt UI's `UDashboardSearch` component
- **Searchable Route**: Application route enriched with metadata (label, icon) for command palette discoverability
- **Aside**: Dashboard sidebar navigation panel containing app logo, navigation menus, and user profile footer
- **Navigation Item**: Single menu entry representing internal route or external link with label and icon
- **Permission-Aware Navigation**: Navigation menus that dynamically show/hide items based on user's admin status
- **Layout Context**: Application area a layout serves (dashboard, documentation, marketing, minimal)
- **Navigation Tree**: Hierarchical menu structure auto-loaded from Nuxt Content collections for docs/blog navigation
- **Mobile Navbar**: Collapsed version of sidebar navigation shown on small screens with hamburger menu toggle
- **Responsive Collapse**: Behavior where desktop sidebar converts to mobile navbar below 768px viewport width

_Product-wide terms (User, Module, Layer, Route, Component) defined in product README._

## Notes for Future AI Agents

- **This module defines layout structure, never application features**
- **Layouts are stateless presentation infrastructure - no data persistence**
- **Every page in application must use one of the four layout templates**
- **If adding new layout template, follow existing naming pattern and document in this README**
- **Navigation items defined statically in constants - modify `asideNavigation.ts` to change menus**
- **Command palette requires `layout: 'default'` and `meta.search` configuration on pages**
- **Admin navigation filtering happens at render time via `useUserStore().isAdmin` check**
- **Layout components globally auto-imported by Nuxt - available without explicit imports**
- **This module loads after `01.base` and before feature layers (indicated by `02.` prefix)**
- **If product README contradicts this document, product README wins (higher authority)**
- **Layout selection and search configuration examples documented in Frontend Pages section**
