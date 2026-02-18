# View All Notes

## Story
**As a** authenticated user  
**I want** to see a complete list of all my notes in sidebar  
**So that** I can browse and access any note quickly

**Module:** Notes

## Acceptance Criteria
- [ ] Sidebar displays all user's notes in flat list
- [ ] Each note shows title and preview/metadata (last updated time)
- [ ] Notes ordered by user's custom position (from drag-to-reorder)
- [ ] List loads within 500ms on page load
- [ ] Scrollable if notes exceed viewport height
- [ ] Empty state shown when user has no notes
- [ ] Active note highlighted in list

## How it Works
1. User navigates to `/notes` page
2. GET request to `/api/notes` fetches all note metadata (title, id, updated, position)
3. Sidebar renders notes in position order
4. Each note item displays title and "Last edited: [relative time]"
5. Clicking note navigates to `/notes/[id]` and loads full content
6. Currently viewed note highlighted with background color/border
7. Scroll position preserved when navigating between notes

## Alternate Flows
- **No notes yet (empty state)**: Show illustration with "No notes yet" message and "Create your first note" CTA button
- **Very large note collection (500+ notes)**: Implement virtual scrolling to only render visible items for performance
- **Slow network**: Show skeleton loaders in sidebar while notes load

## Edge Cases
- User has exactly 1 note: Sidebar shows single item, no scrolling needed
- Note titles very long (>100 chars): Truncate with ellipsis "Title text that is very lo..."
- Notes with identical titles: Both displayed, distinguished by ID in URL when clicked
- Sidebar narrow on mobile: Switch to collapsible drawer or full-screen list view
- No network connection: Show cached notes if available, display offline indicator

## Notes
- GET `/api/notes` returns minimal data (no full content) for fast list rendering
- Full note content loaded separately when note clicked (lazy loading)
- Relative time format: "2 minutes ago", "3 hours ago", "Yesterday", "Jan 15"
- Virtual scrolling library: Consider `vue-virtual-scroller` for 500+ notes
- Preserve scroll position using Vue Router's scroll behavior or composable
- Active note highlight: subtle background color (e.g., gray-100 in light mode)
- Preview text (first 50 chars of content) optional — may clutter UI in flat list design
