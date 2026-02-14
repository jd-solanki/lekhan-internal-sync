# Blog Module

Markdown-based blog content authoring, organization, and public rendering for reader engagement.

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Authoring and storing blog posts as markdown files with frontmatter metadata
- Defining blog post schema (title, description, image, date, category)
- Rendering blog posts with syntax highlighting and MDC component support
- Organizing blog posts by category (Release, Tutorial, Announcement, Article)
- Listing all blog posts with metadata on blog index page
- Providing previous/next post navigation within blog post detail pages
- Pre-rendering all blog pages as static HTML at build time for performance
- Generating sitemap entries for all blog posts via SEO integration
- Displaying blog post publication dates and category labels

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

#### BlogPost

**Meaning:** Represents a single published blog article written in markdown format with frontmatter metadata.

**Key Attributes:**

- **title**: Human-readable post title, required, displayed in listings and detail header
- **description**: Brief summary of post content, required, used for meta tags and listing previews
- **image**: URL to featured image for post, required, displayed in Open Graph tags and listing cards
- **date**: Publication date, required, displayed as formatted timestamp below title
- **category**: Post classification, enum of [Release, Tutorial, Announcement, Article], defaults to 'Article', displayed as label
- **path**: URL path derived from markdown filename (e.g., `/blog/why-nuxt-layers-are-revolutionary`), used for routing and linking
- **body**: Markdown content with headings, paragraphs, code blocks, etc.
- **toc**: Table of contents extracted from heading hierarchy, displayed in right sidebar for navigation

**Lifecycle Rules:**

- Created by adding new markdown file with valid frontmatter
- Published immediately when file present (no draft state)
- Publication date (`date` field) must be set manually in frontmatter, does not auto-populate
- Path derived from filename (e.g., `post-name.md` → `/blog/post-name`)
- Removing markdown file unpublishes post (removed from listings and detail pages return 404)
- Updating markdown file content triggers rebuild and re-renders post
- Table of contents auto-generated from markdown headings during build
- Pre-rendering happens at build time, not runtime

### Relationships

**Within Module:**

- **BlogPost** → **BlogPost**: Sequential relationship (previous/next navigation)
  - **Meaning**: Posts link to adjacent posts in collection for reader discovery
  - **Integrity Rule**: Surround navigation computed at query time based on collection order, no stored references

**Cross-Module References:**

- **BlogPost** ↔ **Base Module Utilities**: Uses shared content configuration and markdown rendering
  - **Integration Point**: Blog extends base Nuxt Content setup with collection-specific schema
  - **Contract**: Blog collection defined in `content.config.ts`, inherits base content parser and renderer

- **BlogPost** ↔ **Docs Module Components**: Reuses docs layout and UI components
  - **Integration Point**: Blog pages use `layout: 'docs'` and Nuxt UI components (UPage, UPageHeader, UBlogPost, etc.)
  - **Contract**: Blog depends on docs layer being loaded to access layout and component definitions

- **BlogPost** → **SEO Module**: Generates sitemap, OG images, and meta tags
  - **Integration Point**: Blog uses `asSitemapCollection()` wrapper in content config
  - **Contract**: Blog collection automatically registers with @nuxtjs/seo for sitemap generation and SEO frontmatter support

### Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- **Schema validation**: All blog posts must include required frontmatter fields (title, description, image, date) or build fails
- **Category constraint**: Category field must be one of four allowed values [Release, Tutorial, Announcement, Article], defaults to 'Article'
- **Pre-rendering requirement**: All blog routes (`/blog/**`) must be pre-rendered at build time (configured in nuxt.config.ts)
- **Path uniqueness**: Each blog post filename must be unique within `content/blog/` directory to prevent routing conflicts
- **Markdown format**: Blog posts must be valid markdown files; other formats (MDX, AsciiDoc) not supported
- **Public accessibility**: All blog posts are publicly accessible, no authentication required to read
- **Date format flexibility**: Date field accepts any format coercible to JavaScript Date (ISO strings, timestamps, human-readable dates)
- **Image URL validation**: Image field must be valid URL (absolute or relative), no file upload handling in blog module
- **SEO integration**: Blog collection must use `asSitemapCollection()` wrapper to enable automatic sitemap generation
- **Layout dependency**: Blog pages must use 'docs' layout from Docs Module, not standalone blog-specific layout

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **01.base Module**: For Nuxt Content configuration, shared utilities (date formatting, URL helpers), and Nuxt UI component library
- **Docs Module**: For 'docs' layout used on blog pages and shared documentation UI components (UPage, UPageHeader, UBlogPost, UBlogPosts, UContentToc, UBreadcrumb)

**Depended on by:**

- No modules currently depend on Blog Module (blog is leaf module in dependency graph)

**Integration Contract:**

- Blog module extends base content configuration by defining `blog` collection in own `content.config.ts`
- Blog pages explicitly set `layout: 'docs'` in `definePageMeta()` to use Docs Module layout
- Blog queries collection using `queryCollection('blog')` API from base Nuxt Content setup
- Child projects can remove blog module without affecting other modules (no reverse dependencies)

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

**Core Interaction Principles:**

- **Frictionless discovery**: Blog index displays all posts with clear visual hierarchy (title, description, date, category) enabling quick scanning
- **Content-first reading**: Blog post detail pages prioritize typography and readability with minimal UI chrome
- **Persistent navigation**: Breadcrumb shows path from blog index to current post; table of contents provides in-page navigation for long articles
- **Sequential exploration**: Previous/next post navigation encourages readers to explore adjacent content after finishing article
- **Visual consistency**: Blog uses same layout and design system as documentation (docs layout) for cohesive brand experience
- **Metadata transparency**: Readers see publication date and category prominently to assess content freshness and relevance
- **Fast performance**: Pre-rendered static pages load instantly without server round trips or client-side data fetching delays

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section._
>
> _**SEO & Routing Convention**: Use semantic, descriptive URLs following Nuxt's filesystem-based routing. URLs should reflect page purpose and create logical hierarchy for both users and search engines._

**Pages:**

- **/blog**: Blog index listing all published posts with title, description, image, date, and category
- **/blog/[...slug]**: Individual blog post detail page with full markdown content, table of contents, and previous/next navigation

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients._

**Content Collection API:**

Blog content is queryable via Nuxt Content collection API. The `blog` collection provides type-safe blog post objects with validated frontmatter fields.

**No HTTP API Endpoints:**

Blog module provides no custom API routes. All content accessed via Nuxt Content's built-in collection query API at build time and runtime.

**SEO Integration:**

- Blog collection automatically registers sitemap entries
- Each post generates Open Graph meta tags
- Breadcrumb structured data support

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **BlogPost**: Single published article written in markdown format with frontmatter metadata
- **Frontmatter**: YAML metadata block at top of markdown file defining title, description, image, date, category
- **Category**: Classification field for grouping posts (Release, Tutorial, Announcement, Article)
- **Slug**: URL-safe identifier derived from markdown filename (e.g., `why-nuxt-layers.md` → `why-nuxt-layers`)
- **Surround Navigation**: Previous/next post links based on collection order
- **Table of Contents (TOC)**: Hierarchical list of headings extracted from markdown content for in-page navigation
- **Pre-rendering**: Build-time static HTML generation for blog pages (no server-side rendering at request time)
- **Blog Index**: Listing page displaying all blog posts at `/blog` route

_Product-wide terms (Module, Layer, Content Collection) defined in product README._

## Notes for Future AI Agents

- **This document defines module-level WHAT, never HOW**
- **All module behavioral truth flows from here**
- **Module must respect product README authority (higher in hierarchy)**
- **If product README contradicts this, product README wins**
- **Frontend pages and API endpoints listed here are high-level overviews**
- **Detailed page/API specs live in subdirectories, not here**
- **Implementation may change; domain semantics must not**
- Blog posts are markdown files on filesystem, not database records
- No authentication, comments, or admin UI by design (simplicity choice)
- Blog uses Docs Module layout — removing docs module breaks blog
- Pre-rendering is mandatory for blog performance (configured in nuxt.config.ts)
- Category enum is closed set — adding categories requires schema change
- Child projects can fork and customize blog schema for their needs
