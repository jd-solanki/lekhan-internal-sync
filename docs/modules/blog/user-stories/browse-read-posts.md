# User Story: Browse & Read Blog Posts

## Story
**As a** visitor (guest or authenticated)  
**I want** to browse and read blog articles  
**So that** I can learn helpful information and stay updated

**Module:** blog

## Acceptance Criteria
- [ ] User can navigate to `/blog` to see blog listing
- [ ] Blog listing displays all posts with title, description, date, category
- [ ] Posts ordered by publish date (newest first)
- [ ] User can click post to navigate to `/blog/[...slug]`
- [ ] Article page renders full markdown content
- [ ] Article displays table of contents generated from headings
- [ ] Article shows prev/next navigation to other posts
- [ ] SEO metadata populated from frontmatter
- [ ] Syntax highlighting for code blocks
- [ ] Images and media embedded in articles render correctly
- [ ] Article content responsive on mobile devices

## How it Works
1. User navigates to `/blog`
2. System queries all blog posts via Nuxt Content `queryCollection('blog')`
3. Blog listing rendered with post metadata
4. User clicks article link
5. System fetches specific post by slug
6. Markdown content rendered with table of contents
7. Prev/next navigation shows adjacent articles

## Alternate Flows
- **Category filtering**: User can filter posts by category (if implemented)
- **Search**: User can search blog posts (if implemented)
- **Tag navigation**: User can view posts by tag (if implemented)

## Edge Cases
- Blog with no posts (empty state)
- Post slug collision with reserved routes
- Markdown rendering errors with malformed content
- Images fail to load or are missing
- Very long articles affecting TOC rendering

## Notes
- No authentication required for blog access
- Content stored as markdown in `/content/blog`
- Nuxt Content v3 handles queries and rendering
- Frontmatter defines metadata (title, date, category, etc.)
- TOC auto-generated from markdown headings
- Public middleware may initialize stores for embedded pricing displays
