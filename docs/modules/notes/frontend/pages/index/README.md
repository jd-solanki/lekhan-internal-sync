# Notes List View

> _Browse and access all notes in a searchable, reorderable sidebar with instant note creation._

**Module:** `notes`
**Route:** `/notes`
**Access:** Protected
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Display all user's notes in a sidebar list view, providing fast search, drag-to-reorder capability, and instant note creation without leaving the page.

### Primary User Goal

Browse all notes at a glance, quickly find specific notes using search, and create new notes instantly to start capturing ideas.

### Context

This is the main landing page for the notes module after user authentication. Users navigate here from the sidebar navigation or command palette. The page serves as both a standalone notes list view and a persistent sidebar that remains visible when editing individual notes at `/notes/[id]`.

---

## Route

**Path Pattern:** `/notes`

**Route Parameters:** None

**Query Parameters:**
- `q`: Search query string (optional) — filters notes by title and content

---

## Access

**Type:** protected

**Access Rules:**
- User must be authenticated
- User can only see their own notes (enforced by API via userId)
- Redirect to `/auth/login` if not authenticated (via private middleware)
- No role-based restrictions (all authenticated users have access)

---

## Page States

### Loading State

Initial data fetch while notes metadata loads.

**Display:**
- Sidebar shows skeleton loaders for 3-5 note items
- Search bar visible but disabled (grayed out)
- "New Note" button disabled during load
- Main content area shows loading spinner or skeleton

### Empty State

User has no notes yet.

**Display:**
- Illustration showing empty notebook or document icon
- Heading: "No notes yet"
- Subtext: "Create your first note to start capturing ideas"
- Large "Create your first note" call-to-action button
- Search bar visible but disabled (grayed out)

### Error State

API call fails due to network issue or server error.

**Display:**
- Error banner at top of sidebar: "Unable to load notes. Please try again."
- Retry button in error banner
- Contact support link if error persists after retry
- Main content area shows error illustration

### Success State

Notes loaded successfully and displayed in sidebar.

**Display:**
- Sidebar shows all notes in flat list
- Each note item displays title and last updated time
- Search bar active and ready for input
- "New Note" button prominent at top of sidebar
- Main content area shows welcome message or selected note hint
- Scroll enabled if notes exceed sidebar height

---

## Content

### Data Displayed

**Notes List (Sidebar):**

- **Note items**: From `GET /api/notes` — Display as vertical list in sidebar
  - Title (bold, truncated to 60 chars with ellipsis if longer)
  - Last updated timestamp (relative: "2 minutes ago", "3 hours ago", "Yesterday", "Jan 15")
  - Note ID (hidden, used for navigation)
  - Position (hidden, used for drag-to-reorder)

- **Search query**: From URL `?q=` param — Display in search input with clear button

- **Note count**: Total number of notes and plan limit — Display in sidebar header: "45 / 50 notes" (Starter plan example)

**Main Content Area:**

- Welcome message: "Select a note to view or create a new one"
- Optional: Quick tips or keyboard shortcuts guide

### Conditional Visibility

**"New Note" button:**
- Enabled if user under plan limit (count < limit)
- Disabled if user at plan limit (count === limit)
- Shows tooltip on hover: "Create new note (Cmd/Ctrl+N)" or "Upgrade to create more notes (at limit)"

**Plan limit warning:**
- Only shown when within 5 notes of plan limit
- Banner at bottom of sidebar: "You're using 48 of 50 notes. Upgrade to Pro for 200 notes."
- Includes "Upgrade" button linking to `/app/billing`

**Search results empty state:**
- Only shown when search query active and no matches found
- Replaces note list with: "No notes found matching '[query]'. Try a different search."

**Drag handles:**
- Visible on hover for each note item (⋮⋮ icon)
- Cursor changes to grab hand when hovering over draggable area

---

## User Actions

### Search Notes

**Trigger:** User types in search input at top of sidebar
**Outcome:** 
- Notes list filters to show only matches (title or content contains query)
- URL updates with `?q=[query]` parameter
- Results update in real-time as user types (200ms debounce)
- Search is case-insensitive and matches partial words
**Feedback:** 
- Result count shows in sidebar: "Found 12 notes" or "No notes found"
- Matched text highlighted in note titles (yellow background or bold)
- Empty search (cleared input) restores full note list

### Create New Note

**Trigger:** User clicks "New Note" button in sidebar or presses Cmd/Ctrl+N
**Outcome:** 
- System checks if under plan limit (Starter: 50, Pro: 200, Max: unlimited)
- If under limit: New note created with title "Untitled" and empty content
- Note appears at top of sidebar list
- Navigation to `/notes/[newNoteId]` happens immediately
- Editor loads ready for typing
**Feedback:** 
- Button shows loading spinner during creation (<100ms)
- Instant navigation to editor (no perceived delay)
- If at limit: Modal appears: "You've reached your [plan name] limit of [X] notes. Upgrade to create more." with "Upgrade" and "Cancel" buttons

### Open Note

**Trigger:** User clicks on note item in sidebar
**Outcome:** 
- Navigate to `/notes/[id]` route
- Full note content loads in editor
- Clicked note highlighted in sidebar (active state)
- Sidebar remains visible (persistent navigation)
**Feedback:** 
- Note item highlights on hover (light background)
- Cursor changes to pointer
- Active note has distinct background color (e.g., blue tint or border)

### Clear Search

**Trigger:** User clicks "X" icon in search input or clears text manually
**Outcome:** 
- URL `?q=` parameter removed
- Full note list restored in sidebar
- Search input cleared
**Feedback:** 
- Note count updates to show total: "[total] notes"
- Smooth transition as filtered items reappear

### Drag to Reorder Notes

**Trigger:** User clicks and drags note item by grab handle (⋮⋮ icon)
**Outcome:** 
- Note visually lifts and follows cursor
- Drop indicator line appears between note items
- Dropping note updates position immediately (optimistic UI)
- `PATCH /api/notes/reorder` persists new order
- If API call fails, revert to original order with error toast
**Feedback:** 
- Dragged note becomes semi-transparent and elevated
- Drop zone indicated by horizontal blue line between items
- Other notes shift smoothly to make space
- Cursor shows grab hand during drag
- On drop: subtle animation as note settles into position
- Error toast if save fails: "Failed to save order. Retrying..."

### Upgrade Plan (at limit)

**Trigger:** User clicks "Upgrade" button in limit warning banner or in blocked "New Note" modal
**Outcome:** 
- Navigate to `/app/billing` page
- Billing page highlights available plans with note limit differences
**Feedback:** 
- Smooth navigation transition
- Billing page shows current plan and upgrade options

---

## Wireframes Needed

### Desktop Layout

- **ui-desktop-success.md**: Full page with sidebar (30% width) showing notes list, search bar, "New Note" button, and main content area (70% width) with welcome message
- **ui-desktop-loading.md**: Skeleton loaders for 5 note items in sidebar during initial data fetch
- **ui-desktop-empty.md**: Illustration and "Create your first note" CTA in main area, empty sidebar with disabled search
- **ui-desktop-error.md**: Error banner in sidebar with retry button, error illustration in main area
- **ui-desktop-search-results.md**: Filtered note list with highlighted matches, result count, active search query in input
- **ui-desktop-at-limit.md**: Warning banner at bottom of sidebar showing limit status and "Upgrade" CTA

### Mobile Layout

- **ui-mobile-success.md**: Collapsible drawer with notes list, floating "+" button for new note, searchable list
- **ui-mobile-loading.md**: Mobile skeleton loaders in drawer
- **ui-mobile-empty.md**: Mobile-optimized empty state with large CTA button
- **ui-mobile-error.md**: Mobile error display with retry button in drawer

### Component Details

- **component-note-item.md**: Individual note card in sidebar showing title, timestamp, hover state, active state, drag handle
- **component-search-bar.md**: Search input with icon, clear button, debounced input
- **component-limit-warning.md**: Warning banner showing current usage and upgrade CTA
- **component-drag-indicator.md**: Visual drop zone line and dragging state appearance

---

## Edge Cases

### No Notes (Empty State)

**Scenario:** User has zero notes (new account or deleted all notes)
**Behavior:** Show empty state with illustration and "Create your first note" CTA
**Test:** Verify empty state renders with correct message and functional CTA button

### Single Note

**Scenario:** User has exactly 1 note
**Behavior:** Note list shows single item, drag handle visible but dragging does nothing (no reorder possible)
**Test:** Verify drag handle appears but drag operation has no effect with single note

### At Plan Limit

**Scenario:** User at plan limit (e.g., 50/50 notes on Starter plan)
**Behavior:** "New Note" button disabled, tooltip shows "Upgrade to create more notes", warning banner visible, clicking button shows upgrade modal
**Test:** Mock user at limit, verify button disabled and modal shows upgrade prompt

### Search No Results

**Scenario:** Search query returns zero matches
**Behavior:** Show empty state in sidebar: "No notes found matching '[query]'. Try a different search."
**Test:** Search for non-existent term, verify empty state message displays

### Network Error Loading Notes

**Scenario:** API call to `GET /api/notes` fails due to network issue
**Behavior:** Show error state with retry option, preserve any cached notes if available
**Test:** Simulate network failure, verify error message and retry button functional

### Very Long Note List (500+ notes)

**Scenario:** User has hundreds of notes
**Behavior:** Implement virtual scrolling to render only visible items, maintain smooth scroll performance
**Test:** Load 500+ notes, verify smooth scrolling and no performance degradation

### Search While Dragging

**Scenario:** User starts dragging note then activates search
**Behavior:** Cancel drag operation on search input focus, reordering disabled while search active
**Test:** Verify drag cancels cleanly when search focused

### Concurrent Modification

**Scenario:** Note created or deleted in another browser session/device
**Behavior:** On next API refresh, new note appears or deleted note disappears with subtle toast: "Notes updated"
**Test:** Create note in different session, verify list updates on polling/refresh

### Session Expires While Searching

**Scenario:** User session expires during active search
**Behavior:** Redirect to login, preserve search query in URL, restore after re-authentication
**Test:** Mock session expiry, verify redirect and query preservation

### Rapid "New Note" Clicks

**Scenario:** User double-clicks "New Note" button rapidly
**Behavior:** Debounce clicks to prevent duplicate note creation (only one note created)
**Test:** Verify single note created even with rapid clicks

### Note Titles Exceed Sidebar Width

**Scenario:** Note title very long (>100 characters)
**Behavior:** Truncate with ellipsis "Very long note title that goes on and on..."
**Test:** Create note with 150-char title, verify truncation at ~60 chars with ellipsis

### Invalid Search Query (Special Characters)

**Scenario:** User searches with regex special characters (e.g., `[test]`, `(notes)`)
**Behavior:** Escape special characters to prevent search errors, treat as literal text
**Test:** Search for `[test]`, verify no errors and literal match

---

## Navigation

### Inbound Navigation (Pages that link TO this page)

**Source:** Sidebar navigation (`asideNavigation.ts`)
**Context:** User clicks "Notes" link in main navigation sidebar
**Link Text:** "Notes"

**Source:** Command palette (Cmd/Ctrl+K)
**Context:** User searches for "notes" in command palette
**Link Text:** "Notes" with document icon

**Source:** Post-login redirect for new users
**Context:** User completes signup and plan selection, redirected to notes as home page
**Link Text:** N/A (automatic redirect)

**Source:** Dashboard/Home (`/app`)
**Context:** User clicks "Go to Notes" quick action or navigation link
**Link Text:** "My Notes" or "View All Notes"

**Source:** Individual note editor (`/notes/[id]`)
**Context:** User deletes current note and auto-redirected to list view
**Link Text:** N/A (automatic redirect after deletion)

### Outbound Navigation (Pages this page links TO)

**Destination:** Individual note editor (`/notes/[id]`)
**Trigger:** User clicks note item in sidebar or "New Note" button
**Link Text:** Note title (for existing notes) or auto-navigation (for new notes)

**Destination:** Billing page (`/app/billing`)
**Trigger:** User clicks "Upgrade" button in limit warning or blocked note creation modal
**Link Text:** "Upgrade" or "Upgrade Plan"

**Destination:** Dashboard/Home (`/app`)
**Trigger:** User clicks "Home" in sidebar navigation
**Link Text:** "Home"

**Destination:** Account settings (`/app/settings` or similar)
**Trigger:** User opens user menu and clicks settings
**Link Text:** "Account Settings"

**Destination:** Login (`/auth/login`)
**Trigger:** Session expires, auto-redirect
**Link Text:** N/A (automatic redirect)

### Breadcrumb Navigation

**Structure:** Not applicable (top-level section, no parent pages)

### Primary Navigation Placement

**Where:** Sidebar navigation (left side on desktop, collapsible drawer on mobile)
**Label:** "Notes"
**Icon:** Document/file icon (`i-lucide-file-text` or similar)
**Active State:** Bold text with blue highlight or underline when on `/notes` or `/notes/*` routes

---

## Notes

**Design Considerations:**
- Sidebar always visible on desktop (30% width), collapsible drawer on mobile
- Note list uses virtual scrolling for collections >100 notes
- Search is client-side for <200 notes, server-side with database indexing for larger collections
- Drag-to-reorder uses `@vueuse/integrations` with SortableJS or native HTML5 drag-and-drop
- Active note highlighting persists in sidebar when viewing note editor

**Performance Targets:**
- Initial load: < 500ms for note list metadata
- Search response: < 100ms perceived latency (200ms debounce + filtering)
- Note creation: < 100ms before navigation to editor
- Smooth 60fps scroll performance even with 500+ notes

**Accessibility:**
- Keyboard navigation: Tab through notes, Enter to open, Cmd/Ctrl+N for new note
- Screen reader: Announce note count, search results, and limit warnings
- Focus management: Return focus to search bar after note creation or deletion
- ARIA labels for drag handles and interactive elements
- Keyboard alternative for reorder: Cmd/Ctrl+Up/Down arrows to move selected note

**Future Enhancements:**
- Note preview on hover (tooltip showing first 100 chars of content)
- Bulk operations (select multiple notes, batch delete)
- Saved searches or search history
- Note templates for quick creation
- Keyboard shortcuts help panel (? key to toggle)
- Export all notes as ZIP archive
