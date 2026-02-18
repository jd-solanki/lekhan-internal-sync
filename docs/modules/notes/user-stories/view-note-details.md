# View Individual Note Details

## Story
**As a** authenticated user  
**I want** to open an individual note to see its full content  
**So that** I can read and edit the complete note

**Module:** Notes

## Acceptance Criteria
- [ ] Clicking note in sidebar navigates to `/notes/[id]`
- [ ] Full note content loads in visual editor (Nuxt UI Editor)
- [ ] Note title editable at top of page
- [ ] Full markdown content rendered in editor ready for editing
- [ ] Note loads within 300ms
- [ ] Auto-save indicator visible
- [ ] Delete button accessible

## How it Works
1. User clicks note in sidebar
2. Router navigates to `/notes/[id]`
3. GET request to `/api/notes/:id` fetches full note data (title, content, metadata)
4. Editor component renders with note content
5. Title displayed in editable heading at top
6. Markdown content loaded into Nuxt UI Editor in visual mode
7. User can immediately start reading or editing
8. Auto-save activates on any changes (3s debounce)

## Alternate Flows
- **Note not found (invalid ID)**: Show 404 page with "Note not found" message and link back to notes list
- **User doesn't own note (wrong userId)**: Return 403 Forbidden, redirect to notes list with error toast
- **Slow network**: Show loading skeleton for editor while content fetches

## Edge Cases
- Very long note content (>50KB): May take longer to render, show progress indicator
- Note with no content (blank): Editor shows empty state, cursor ready for typing
- URL manually edited to another user's note ID: Access denied, redirect to own notes
- Session expired: Redirect to login, preserve note ID to return after re-auth
- Concurrent edit from another device: Last write wins on auto-save, consider showing "updated elsewhere" notification

## Notes
- Page title (browser tab): Set to note title or "Untitled - Notes"
- Editor mode: Visual/WYSIWYG by default, optionally allow markdown source toggle
- Metadata display: Show "Created: [date]" and "Last edited: [date]" at bottom or in sidebar
- Delete button: Positioned in top-right or within note context menu
- Back navigation: Browser back button or close icon to return to notes list
- Focus management: Auto-focus editor content area on note load for immediate typing
- Error handling: If note loads but saves fail, show persistent error banner
