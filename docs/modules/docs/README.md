# Docs Module

Provides markdown-based technical documentation with syntax highlighting, custom code import plugins, and diagram rendering.

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Rendering markdown documentation files with frontmatter metadata
- Providing syntax-highlighted code blocks for technical content
- Rendering Mermaid diagrams with theme-aware styling
- Generating navigation structure from documentation hierarchy
- Supporting code snippet imports from external files via custom markdown plugin
- Prerendering documentation pages for fast static delivery
- Organizing documentation into hierarchical sections

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

#### Document

**Meaning:** Represents a single technical documentation page written in markdown format

**Key Attributes:**

- **title**: User-facing page title, required, displayed in navigation and page header
- **description**: SEO meta description, optional, used for search engine results
- **path**: URL path derived from file location, follows Nuxt Content routing conventions
- **body**: Markdown content including text, code blocks, images, and custom components
- **toc**: Auto-generated table of contents with heading hierarchy, optional

**Lifecycle Rules:**

- Created when markdown file added to `content/docs/` directory
- Path auto-derived from filesystem structure
- Frontmatter parsed from YAML header at file top
- Navigation order determined by numeric prefixes in filenames/directories
- Prerendered at build time into static HTML
- Changes to markdown files trigger rebuild in development mode

#### Navigation Item

**Meaning:** Represents hierarchical structure of documentation sections and pages

**Key Attributes:**

- **title**: Section or page name displayed in sidebar navigation
- **path**: URL path to target page
- **children**: Nested navigation items for subsections

**Lifecycle Rules:**

- Auto-generated from content directory structure
- Updated when files added/removed/renamed
- Reflects filesystem hierarchy (folders become sections, files become pages)
- Preserved during page navigation for consistent sidebar state

### Relationships

**Within Module:**

- **Document** → **Navigation Item**: One-to-one (each document has navigation entry)
  - **Meaning**: Documents appear in navigation sidebar for discovery
  - **Integrity Rule**: Deleting document removes navigation entry; navigation reflects current filesystem

**Cross-Module References:**

- **Document** → **Base Module Content Plugin**: Uses import snippet plugin
  - **Integration Point**: Documents can include code snippets from external files via special syntax
  - **Contract**: Base module provides `remarkImportSnippetPlugin` for markdown transformation

### Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- **Static prerendering**: All documentation pages rendered at build time under `/docs/**` route rule
- **Filename ordering**: Numeric prefixes (e.g., `1.introduction.md`, `2.setup.md`) determine navigation order
- **Path derivation**: URL paths auto-generated from filesystem structure, numeric prefixes stripped from URLs
- **Frontmatter requirement**: Every document must have at minimum a `title` in frontmatter
- **Syntax highlighting themes**: Code blocks use `github-light` theme in light mode, `dracula` theme in dark mode
- **Mermaid lazy loading**: Diagram rendering deferred until scrolled into view via Intersection Observer
- **Theme-aware diagrams**: Mermaid diagrams re-render when color mode changes to match UI theme
- **TOC generation**: Table of contents auto-extracted from markdown headings (h2-h6 levels)
- **No runtime content**: Documentation collection defined at build time, not fetched at runtime

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **01.base Module**: For shared utilities, content configuration, and markdown plugin infrastructure (specifically `remarkImportSnippetPlugin` for code snippet imports)

**Depended on by:**

- **Blog Module**: Reuses docs layer components (`content/Mermaid.vue`) and content rendering patterns

**Integration Contract:**

- Base module provides `remarkImportSnippetPlugin` via content markdown configuration
- Base module provides syntax highlighting theme configuration
- Blog module imports Mermaid component for diagram rendering in blog posts
- Documentation pages use Base module's Nuxt Content setup and shared utilities

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

**Core Interaction Principles:**

- **Readability first**: Clean typography, generous spacing, syntax-highlighted code blocks for technical clarity
- **Progressive disclosure**: Table of contents shows document structure without overwhelming; navigation hierarchy collapsible
- **Context preservation**: Sidebar navigation persists across page changes so users maintain location awareness
- **Theme consistency**: Code highlighting and Mermaid diagrams adapt to light/dark mode automatically
- **Performance focus**: Static prerendering ensures instant page loads; lazy Mermaid rendering reduces initial bundle
- **Accessibility**: Table of contents auto-highlighted on scroll, semantic HTML structure for screen readers
- **Navigation clarity**: Hierarchical sidebar reflects documentation structure, numeric ordering ensures logical flow

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section. Detailed specs live in `frontend/pages/` subdirectories._
>
> _**SEO & Routing Convention**: Use semantic, descriptive URLs following Nuxt's filesystem-based routing. URLs should reflect page purpose and create logical hierarchy for both users and search engines._

**Pages:**

- **/docs/[...slug]**: Documentation page renderer, displays markdown content with navigation sidebar, table of contents, and syntax-highlighted code blocks

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients. Detailed specs live in `backend/api/` subdirectories._

**Capability Categories:**

- Markdown rendering with MDC (Markdown Components) support
- Content collection queries for documentation retrieval
- Navigation structure generation
- Surrounding page queries for prev/next navigation
- Mermaid diagram rendering component (exported for reuse)

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Document**: Individual markdown file representing one documentation page
- **Frontmatter**: YAML metadata block at top of markdown file defining title, description, and other page properties
- **TOC (Table of Contents)**: Auto-generated list of heading links extracted from markdown content
- **Navigation Item**: Entry in sidebar navigation tree representing document or section
- **Slug**: URL-friendly identifier derived from filename (e.g., `introduction.md` → `introduction`)
- **Catch-all Route**: Dynamic route pattern `[...slug]` that matches any path depth under `/docs/`
- **MDC (Markdown Components)**: Nuxt Content feature allowing Vue components within markdown content
- **Code Snippet Import**: Custom markdown syntax for including external code files or regions
- **Mermaid Diagram**: Text-based diagram syntax rendered as interactive graphics
- **Prerendering**: Build-time HTML generation for static page delivery without server-side rendering
- **Surround**: Query returning previous and next pages in content hierarchy for navigation links

_Product-wide terms (User, API, Module, Layer) defined in product README._

## Notes for Future AI Agents

- This README defines **module-level WHAT**, not code inventory
- Documentation structure follows Nuxt Content filesystem routing conventions
- Numeric prefixes in filenames determine navigation order but are stripped from final URLs
- Code snippet import plugin lives in Base module (`01.base/content/plugins/importSnippet.ts`), not here
- Syntax highlighting configuration exists in root `nuxt.config.ts`, theme choice is product-level decision
- Mermaid component can be extended with additional diagram types without changing contract
- Adding new documentation pages requires only creating markdown files, no code changes
- Navigation structure auto-updates based on filesystem changes
- Product-level authority: `docs/README.md` overrides this file on conflict
- If documentation needs interactive features beyond static markdown, escalate to module owner
