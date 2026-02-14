# Website Module

Public-facing website pages and legal/marketing content management.

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Display homepage/landing page for public visitors
- Serve legal content pages (privacy policy, terms & conditions)
- Manage markdown-based legal and marketing content via Nuxt Content
- Provide SEO-optimized public website structure with sitemap integration
- Render content using website-specific layout and styling

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

#### Legal Content

**Meaning:** Represents a single legal or marketing document (privacy policy, terms & conditions) authored in markdown and rendered as public webpage

**Key Attributes:**

- **title**: Human-readable page title displayed in header, extracted from frontmatter, required
- **slug**: URL-friendly identifier derived from filename (e.g., `privacy`, `terms`), unique within legal collection
- **content**: Markdown body with full legal/marketing text, supports standard markdown formatting
- **path**: Full URL path where content is accessible (e.g., `/legal/privacy`), auto-generated from file location

**Lifecycle Rules:**

- Created when markdown file added to `content/legal/` directory with valid frontmatter
- Updated when markdown file content or frontmatter modified (no database writes, file-based only)
- Deleted when markdown file removed from `content/legal/` directory
- Auto-included in sitemap for SEO discoverability via `asSitemapCollection` configuration
- Rendered on-demand when user navigates to `/legal/[slug]` URL

### Relationships

> _How entities relate to each other within this module and to external modules._

**Within Module:**

- **Legal Content** items are independent — no relationships within module (flat content structure)
  - **Meaning**: Each legal document stands alone without dependencies on other documents
  - **Integrity Rule**: Removing one document does not affect others

**Cross-Module References:**

- **Legal Content** → **01.base Module**: Uses Nuxt Content configuration and SEO utilities
  - **Integration Point**: Website Module extends base Nuxt Content setup
  - **Contract**: Depends on `@nuxt/content` and `@nuxtjs/seo` modules configured in base layer

- **Legal Content** ↔ **02.layouts Module**: Uses website layout for rendering
  - **Integration Point**: Pages specify `layout: 'website'` to apply consistent header/footer
  - **Contract**: Layouts Module provides `LayoutWebsiteHeader` and `LayoutWebsiteFooter` components

### Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- Public accessibility: All website content must be accessible without authentication (public routes)
- Sitemap inclusion: Legal content pages auto-registered in sitemap.xml for SEO discoverability
- File-based content: Legal content stored as markdown files, not database records (enables version control via Git)
- URL structure: Legal content served under `/legal/` prefix for consistent organization and SEO
- Layout consistency: All website pages use `website` layout for unified header/footer/branding
- Markdown-only: Content authored exclusively in markdown format with frontmatter metadata

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **01.base Module**: For Nuxt Content configuration, SEO utilities, and shared composables
- **02.layouts Module** (implicit): For website layout components (header, footer, page structure)

**Depended on by:**

- None (Website Module has no dependents — purely presentation layer for public content)

**Integration Contract:**

- Website Module uses `queryCollection('legal')` from Nuxt Content to fetch legal documents
- Pages reference `layout: 'website'` to apply layout from 02.layouts Module
- Content collection configured with `asSitemapCollection` for automatic SEO integration
- No API endpoints exposed — all content served via Nuxt Content's built-in rendering

## UX Philosophy

> _Defines interaction principles for user-facing components. Frontend modules MUST have this section._

**Core Interaction Principles:**

- **Informational clarity**: Legal content presented with clean typography, ample whitespace, and clear hierarchy for readability
- **No barriers**: Zero authentication or paywalls — legal content immediately accessible to all visitors
- **SEO-first**: Semantic URLs (`/legal/privacy` not `/legal?id=123`), descriptive titles, sitemap inclusion for discoverability
- **Consistent branding**: Website layout provides unified header/footer across all public pages for professional appearance
- **Markdown simplicity**: Content authors write plain markdown without touching Vue components or code
- **Static performance**: Content prerendered at build time when possible for instant page loads

## Frontend Pages

> _User-facing pages this module provides. Detailed specs live in `frontend/pages/` subdirectories._
>
> _**SEO & Routing Convention**: Use semantic, descriptive URLs following Nuxt's filesystem-based routing. URLs should reflect page purpose and create logical hierarchy for both users and search engines._

**Pages:**

- **/**: Homepage/landing page with welcome message and product introduction
- **/legal/privacy**: Privacy Policy legal document rendered from markdown
- **/legal/terms**: Terms & Conditions legal document rendered from markdown
- **/legal/[...page]**: Catch-all route for any additional legal/marketing content added to `content/legal/`

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients. Detailed specs live in `backend/api/` subdirectories._

**Endpoints:**

- None (Website Module has no backend API endpoints)

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Legal Content**: Markdown document stored in `content/legal/` representing legal or marketing page (privacy policy, terms, etc.)
- **Website Layout**: Shared layout component (`website.vue`) providing consistent header/footer for all public pages
- **Catch-all Route**: Dynamic route pattern `[...page]` that matches any path segment, enabling extensibility without code changes
- **Legal Collection**: Nuxt Content collection grouping all markdown files in `content/legal/` for unified querying and rendering

_Product-wide terms (Module, Layer, Content Collection, Nuxt Content) defined in product README._

## Notes for Future AI Agents

- **This document defines module-level WHAT, never HOW**
- **All module behavioral truth flows from here**
- **Module must respect product README authority (higher in hierarchy)**
- **If product README contradicts this, product README wins**
- **Frontend pages listed here are high-level overviews**
- **Detailed page specs live in `frontend/pages/` subdirectories, not here**
- **API Surface is intentionally empty** — Website Module has no backend endpoints
- **Content is file-based** — Legal documents are markdown files, not database records
- **Layout dependency implicit** — Pages reference `website` layout from 02.layouts Module but no direct code imports
- **Implementation may change; domain semantics must not**
