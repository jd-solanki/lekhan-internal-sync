# Note Editor

> _Edit individual note with visual markdown editor, auto-save, and persistent sidebar navigation._

**Module:** `notes`
**Route:** `/notes/[id]`
**Access:** Protected
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Provide full-screen markdown editor with visual rich text interface (Nuxt UI Editor) for editing individual notes, with auto-save every 3 seconds and persistent sidebar for quick navigation between notes.

### Primary User Goal

Edit note content seamlessly with visual markdown editing, never lose work due to auto-save, and quickly switch between notes without returning to list view.

### Context

Users navigate here by clicking a note in the sidebar from `/notes` page or after creating a new note. The sidebar remains visible during editing, allowing instant navigation to other notes. This is where users spend most of their time when actively capturing and organizing thoughts.

---

## Route

**Path Pattern:** `/notes/[id]`

**Route Parameters:**
- `id`: Note UUID or unique identifier, must be owned by authenticated user

**Query Parameters:** None

---

## Access

**Type:** protected

**Access Rules:**
- User must be authenticated
- User can only access notes they own (userId validation on API)
- If note ID invalid or doesn't exist: Show 404 page with "Note not found" and link to `/notes`
- If note owned by different user: Return 403 Forbidden, redirect to `/notes` with error toast "You don't have access to this note"
- Redirect to `/auth/login` if not authenticated (via private middleware)

---

## Page States

### Loading State

Initial data fetch while note content loads.

**Display:**
- Sidebar shows full note list (already loaded from previous view)
- Editor area shows skeleton loader for title and content
- Auto-save indicator shows "Loading..."
- Delete button disabled during load

### Empty State

Note exists but has no content (blank note).

**Display:**
- Title field shows "Untitled" (editable)
- Editor shows empty state with placeholder text: "Start typing..."
- Cursor auto-focused in content area
- Auto-save indicator shows "No changes"
- Delete button enabled

### Error State

API call fails to load note or note doesn't exist.

**Display:**
- If 404: "Note not found" heading with message "This note may have been deleted or you don't have access."
- If 403: Redirect to `/notes` with error toast "Access denied"
- If network error: Error banner at top: "Unable to load note. Please try again." with retry button
- Link to return to notes list: "← Back to Notes"

### Success State

Note loaded successfully and ready for editing.

**Display:**
- Title field populated with note title (editable)
- Editor populated with markdown content rendered as rich text
- Sidebar shows note list with current note highlighted
- Auto-save indicator shows "Saved at [time]"
- Delete button enabled in top-right corner
- Metadata footer shows "Created: [date]" and "Last edited: [date]"

---

## Content

### Data Displayed

**Note Content:**

- **Title**: From `GET /api/notes/:id` response — Displayed in large editable heading at top (h1 style)
- **Content**: From `GET /api/notes/:id` response — Markdown content rendered as rich text in Nuxt UI Editor
- **Last updated timestamp**: From response metadata — Displayed in auto-save indicator "Saved at 3:45 PM"
- **Created date**: From response metadata — Displayed in footer: "Created: February 14, 2026"
- **Last edited date**: From response metadata — Displayed in footer: "Last edited: February 14, 2026 at 3:45 PM"

**Sidebar:**

- Full note list (same as `/notes` page)
- Current note highlighted with distinct background color
- Search bar active
- "New Note" button available

**Auto-Save Indicator:**

- Status text: "Saving..." (during save), "Saved at [time]" (after success), "Save failed - Retrying..." (on error)
- Positioned unobtrusively (top-right corner or bottom status bar)

### Conditional Visibility

**Delete button:**
- Always visible in top-right corner or context menu
- Disabled during note loading
- Shows confirmation modal before deletion

**Auto-save indicator:**
- "No changes" when content unchanged since load
- "Saving..." when PATCH request in-flight
- "Saved at [time]" after successful save
- "Save failed - Retrying..." on network error with automatic retry

**Metadata footer:**
- Always visible at bottom of editor
- Shows created and last edited timestamps
- Created date never changes, last edited updates after each auto-save

**Title placeholder:**
- "Untitled" shown if title field empty
- Placeholder text grayed out, disappears on focus

**Content placeholder:**
- "Start typing..." shown when content empty
- Disappears immediately when user starts typing

---

## User Actions

### Edit Title

**Trigger:** User clicks on title heading at top and types
**Outcome:** 
- Title becomes editable inline (no separate field)
- Debounced auto-save triggers 3 seconds after typing stops
- `PATCH /api/notes/:id` with updated title
- Sidebar note item updates immediately (optimistic)
**Feedback:** 
- Auto-save indicator shows "Saving..." then "Saved at [time]"
- If save fails: Error toast "Failed to save title. Retrying..." with automatic retry

### Edit Content

**Trigger:** User types, formats text, or pastes content in Nuxt UI Editor
**Outcome:** 
- Content changes rendered immediately in visual editor
- Debounced auto-save triggers 3 seconds after typing stops
- `PATCH /api/notes/:id` with markdown content (not HTML)
- Editor remains responsive during save (non-blocking)
**Feedback:** 
- Auto-save indicator shows "Saving..." during request
- Changes to "Saved at [time]" after success
- If save fails: Persistent error banner "Auto-save failed. Your changes are stored locally. We'll retry automatically." with manual "Save Now" button

### Format Text (Rich Text Controls)

**Trigger:** User selects text and clicks bold, italic, heading, list, etc. in Nuxt UI Editor toolbar
**Outcome:** 
- Selected text formatted visually (e.g., bold, italic)
- Underlying markdown syntax updated (e.g., `**bold**`, `_italic_`)
- Auto-save triggers 3 seconds after formatting applied
**Feedback:** 
- Formatting applies instantly with visual feedback
- Toolbar button highlights when format active (e.g., bold button highlighted when cursor in bold text)

### Switch to Another Note

**Trigger:** User clicks different note in sidebar while editing current note
**Outcome:** 
- If unsaved changes exist (within 3s debounce window): Trigger immediate save before navigation
- Navigate to `/notes/[newId]`
- Sidebar highlight moves to newly selected note
- Editor content swaps to new note
- Scroll position preserved in sidebar
**Feedback:** 
- Smooth transition with loading state (skeleton) during fetch
- Auto-save indicator briefly shows "Saving..." if changes pending
- Navigation happens immediately (optimistic, save happens in background)

### Delete Note

**Trigger:** User clicks delete icon/button in top-right corner
**Outcome:** 
- Confirmation modal appears: "Delete '[Note Title]'? This action is permanent and cannot be undone."
- User clicks "Delete" button in modal
- `DELETE /api/notes/:id` request sent
- Note removed from sidebar immediately (optimistic)
- Auto-redirect to `/notes` (list view)
- Success toast: "Note deleted"
**Feedback:** 
- Modal has destructive "Delete" button (red) and "Cancel" button (gray)
- If delete fails: Restore note in sidebar, error toast "Failed to delete note", remain on current page
- Focus returns to notes list after deletion

### Cancel Delete

**Trigger:** User clicks "Cancel" in delete confirmation modal or presses Escape
**Outcome:** 
- Modal closes
- Note remains unchanged
- Editor returns to normal state
**Feedback:** 
- Modal fades out smoothly
- No toast or notification (silent operation)

### Navigate Back to List

**Trigger:** User clicks "← Back to Notes" link or browser back button
**Outcome:** 
- If unsaved changes exist (within 3s debounce window): Trigger immediate save before navigation
- Navigate to `/notes`
- Sidebar remains visible (no layout change)
- Main content area shows welcome message or last active note hint
**Feedback:** 
- Brief auto-save indicator if changes pending
- Smooth navigation transition

### Create New Note (from editor)

**Trigger:** User clicks "New Note" button in sidebar while editing current note
**Outcome:** 
- Same as "Create New Note" action from `/notes` page
- If under plan limit: New note created
- Navigate to `/notes/[newId]`
- Current note auto-saved before navigation
**Feedback:** 
- Button shows loading spinner briefly
- Instant navigation to new blank editor

---

## Wireframes Needed

### Desktop Layout

- **ui-desktop-success.md**: Full page with sidebar (30% width) showing notes list, main editor area (70% width) with title, Nuxt UI Editor, auto-save indicator, delete button, metadata footer
- **ui-desktop-loading.md**: Skeleton loaders for title and editor content while note loads
- **ui-desktop-empty.md**: Empty note with "Untitled" title placeholder and "Start typing..." content placeholder
- **ui-desktop-error.md**: Error message with "Note not found" or network error, retry button, link back to notes list
- **ui-desktop-delete-modal.md**: Confirmation modal for deletion with warning message and destructive action buttons

### Mobile Layout

- **ui-mobile-success.md**: Full-screen editor with collapsible sidebar drawer, title at top, editor below, floating toolbar for rich text controls
- **ui-mobile-loading.md**: Mobile skeleton loaders for title and content
- **ui-mobile-empty.md**: Mobile-optimized empty state with placeholders
- **ui-mobile-delete-modal.md**: Mobile delete confirmation modal

### Component Details

- **component-title-editor.md**: Inline editable title heading with focus state, placeholder, auto-save integration
- **component-nuxt-ui-editor.md**: Rich text editor toolbar with formatting controls, markdown output, focus state
- **component-autosave-indicator.md**: Status display showing "Saving...", "Saved at X:XX PM", or error states
- **component-delete-button.md**: Delete icon/button with hover state, click opens confirmation modal
- **component-metadata-footer.md**: Created and last edited timestamps, unobtrusive placement
- **component-delete-confirmation.md**: Modal with warning text, destructive action buttons

---

## Edge Cases

### Note Not Found (Invalid ID)

**Scenario:** User navigates to `/notes/invalid-uuid` or note deleted by another session
**Behavior:** Show 404 error state: "Note not found. This note may have been deleted." with link to `/notes`
**Test:** Navigate with malformed ID, verify 404 page renders with back link

### Access Denied (Wrong User)

**Scenario:** User navigates to note ID owned by different user
**Behavior:** Return 403 Forbidden, redirect to `/notes` with error toast "You don't have access to this note"
**Test:** Mock note with different userId, verify redirect and toast

### Very Long Note Content (>100KB)

**Scenario:** Note has extensive content (>50,000 words)
**Behavior:** Show warning at 90KB: "Note size approaching limit (90KB of 100KB)". Block edits at 100KB: "Note too large. Please split into smaller notes."
**Test:** Create note with 100KB+ content, verify warning and blocking behavior

### Network Error During Load

**Scenario:** API call to `GET /api/notes/:id` fails
**Behavior:** Show error state with retry option, display error banner: "Unable to load note. Please try again."
**Test:** Simulate network failure, verify error message and retry functionality

### Save Fails During Editing

**Scenario:** Auto-save PATCH request fails due to network issue
**Behavior:** Show persistent error banner "Auto-save failed. Your changes are stored locally. We'll retry automatically." with manual "Save Now" button. Retry with exponential backoff (3 attempts max).
**Test:** Simulate save failure, verify retry mechanism and manual save option

### Session Expires During Editing

**Scenario:** User edits note, session expires before auto-save
**Behavior:** Queue unsaved changes, redirect to login, restore note content after re-auth, complete save automatically
**Test:** Mock session expiry, verify content preservation and post-login save

### Navigate Away Before Auto-Save

**Scenario:** User types, then navigates to different note within 3-second debounce window
**Outcome:** Trigger immediate save before navigation (bypass debounce), ensure no data loss
**Test:** Type in note, click another note immediately (<3s), verify content saved

### Delete Note with Unsaved Changes

**Scenario:** User has pending changes (within 3s debounce), clicks delete
**Behavior:** Deletion takes precedence (no save needed since content being destroyed), proceed with delete confirmation
**Test:** Type in note, immediately click delete, verify no save attempt

### Concurrent Edit from Another Device

**Scenario:** Note edited and saved in another browser/device while user viewing same note
**Behavior:** Last write wins on next auto-save. Show toast: "Note updated from another device. Refresh to see changes." with "Refresh" button.
**Test:** Simulate concurrent edit, verify conflict detection and notification

### Title Only Whitespace

**Scenario:** User deletes all title text, leaves only spaces
**Behavior:** Treat as "Untitled", save as empty string, display placeholder
**Test:** Enter only spaces in title, verify placeholder "Untitled" appears

### Very Long Title (>200 characters)

**Scenario:** User enters extremely long title
**Behavior:** Allow up to 200 characters, truncate in sidebar display with ellipsis, show full title in editor
**Test:** Enter 300-char title, verify truncation in sidebar but full display in editor

### Rapid Note Switching

**Scenario:** User clicks multiple notes rapidly in sidebar
**Behavior:** Debounce navigation to prevent race conditions, complete pending save before switching, show loading state during transition
**Test:** Rapidly click 5 notes, verify smooth transitions and no content mixing

### Browser Refresh During Editing

**Scenario:** User refreshes browser with unsaved changes (within 3s window)
**Behavior:** Browser `beforeunload` event triggers immediate save attempt, show confirmation dialog "You have unsaved changes. Leave anyway?"
**Test:** Type content, immediately refresh, verify save attempt and confirmation dialog

### Empty Note Never Edited

**Scenario:** User creates note but never types anything, leaves content blank
**Behavior:** Note persists as empty (no auto-deletion), still counts toward plan limit
**Test:** Create note, navigate away without typing, verify note exists in list

### Markdown Syntax in Visual Editor

**Scenario:** User types raw markdown like `**bold**` instead of using toolbar
**Behavior:** Visual editor auto-converts to formatted text, shows bold visually, stores as markdown
**Test:** Type `**test**`, verify conversion to bold visual display

### Paste HTML Content

**Scenario:** User copies formatted text from website and pastes into editor
**Behavior:** Nuxt UI Editor converts HTML to markdown, displays visually, stores markdown only (no HTML in database)
**Test:** Paste complex HTML, verify markdown conversion and visual rendering

---

## Navigation

### Inbound Navigation (Pages that link TO this page)

**Source:** Notes list view (`/notes`)
**Context:** User clicks note item in sidebar
**Link Text:** Note title

**Source:** Notes list view (`/notes`)
**Context:** User clicks "New Note" button, new note created
**Link Text:** N/A (auto-navigation to newly created note)

**Source:** Command palette (Cmd/Ctrl+K)
**Context:** User searches for note title, selects from results
**Link Text:** Note title in command palette results

**Source:** Direct URL / Bookmark
**Context:** User navigates directly to `/notes/abc123` via browser
**Link Text:** N/A (direct navigation)

**Source:** Post-deletion redirect from different note
**Context:** User deletes a note while editing it, auto-redirects to `/notes`, then clicks another note
**Link Text:** Note title in sidebar

### Outbound Navigation (Pages this page links TO)

**Destination:** Notes list view (`/notes`)
**Trigger:** User deletes current note (auto-redirect), clicks "← Back to Notes", or browser back button
**Link Text:** "← Back to Notes" or auto-redirect

**Destination:** Other note editors (`/notes/[otherId]`)
**Trigger:** User clicks different note in sidebar
**Link Text:** Note title in sidebar

**Destination:** Billing page (`/app/billing`)
**Trigger:** User clicks "Upgrade" in plan limit warning (if approaching limit while editing)
**Link Text:** "Upgrade Plan"

**Destination:** Dashboard/Home (`/app`)
**Trigger:** User clicks "Home" in sidebar navigation
**Link Text:** "Home"

**Destination:** Login (`/auth/login`)
**Trigger:** Session expires, auto-redirect with return URL
**Link Text:** N/A (automatic redirect)

### Breadcrumb Navigation

**Structure:** Notes > [Note Title]

**Example:** `Notes > Meeting Notes`

**Implementation:**
- Clickable "Notes" link returns to `/notes`
- Current note title shown but not clickable (current page)

### Primary Navigation Placement

**Where:** Sidebar navigation remains visible during editing (persistent across note pages)
**Label:** Current note highlighted in sidebar note list
**Icon:** Note items use document icon, current note has distinctive highlight
**Active State:** Bold text with blue background highlight for currently viewed note

---

## Notes

**Design Considerations:**
- Editor uses Nuxt UI Editor component for visual markdown interface
- Full-screen editor layout (minimal distractions per product philosophy)
- Sidebar always visible on desktop (30% width), collapsible on mobile
- Auto-save every 3 seconds using debounced composable (`useDebounceFn` from VueUse)
- Browser tab title updates to note title: "[Note Title] - Notes"
- Keyboard shortcuts: Cmd/Ctrl+S forces immediate save, Escape to return to `/notes`

**Performance Targets:**
- Note load: < 300ms from API request to editor ready
- Auto-save: < 200ms API response time (unnoticed during typing)
- Content rendering: < 100ms for notes up to 10,000 words
- Smooth 60fps editor performance even with heavy formatting

**Accessibility:**
- Keyboard navigation: Tab between title, editor, delete button, sidebar
- Screen reader: Announce auto-save status changes, deletion confirmation
- Focus management: Auto-focus editor content area on note load
- ARIA labels for toolbar buttons, delete action, auto-save indicator
- Keyboard shortcuts help: Cmd/Ctrl+/ to show shortcuts overlay

**Future Enhancements:**
- Version history (view previous saves, restore older version)
- Markdown source view toggle (switch between visual and raw markdown)
- Word count display in metadata footer
- Export note as PDF or plain markdown file
- Split-screen view (editor + preview side-by-side)
- Distraction-free mode (hide sidebar, full-screen editor only)
- Collaborative editing (real-time co-authoring) — currently out of scope per product README
