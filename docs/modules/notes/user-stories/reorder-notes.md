# Reorder Notes by Dragging

## Story
**As a** authenticated user  
**I want** to drag notes to rearrange them in sidebar  
**So that** I can organize my notes in my preferred order

**Module:** Notes

## Acceptance Criteria
- [ ] User can drag note by grabbing anywhere on note item in sidebar
- [ ] Visual feedback shows note being dragged (semi-transparent, elevated)
- [ ] Drop zones indicated with visual guides (horizontal line between items)
- [ ] Dropping note updates position immediately in UI
- [ ] New order persisted to database
- [ ] Other notes shift positions to accommodate reordered note
- [ ] Works on both desktop (mouse) and touch devices

## How it Works
1. User clicks/taps and holds on note in sidebar
2. Note becomes draggable (cursor changes, note visually lifts)
3. User drags note up or down in list
4. Drop indicator line shows where note will land
5. User releases, note settles into new position
6. UI updates immediately (optimistic)
7. PATCH request to `/api/notes/reorder` persists new positions
8. If request fails, revert to original order with error toast

## Alternate Flows
- **Drag cancelled**: User presses Escape or drags outside drop zone — note returns to original position
- **Network failure during persist**: Show error toast "Failed to save order. Retrying..." and retry automatically
- **Concurrent reorder from another device**: Last write wins, show subtle notification "Note order updated from another device"

## Edge Cases
- User has only 1 note: Drag handle visible but dragging does nothing (no reordering possible)
- Drag over search results: Reordering disabled when search active (show toast: "Clear search to reorder notes")
- Very long note list (500+ notes): Virtual scrolling may complicate drag-drop — auto-scroll when dragging near top/bottom edges
- Rapid repeated reorders: Debounce persistence calls to avoid flooding server
- Touch device gestures conflict: Distinguish between drag-to-scroll and drag-to-reorder with delay/threshold

## Notes
- Use library like `@vueuse/integrations` with SortableJS or native HTML5 drag-and-drop
- Position stored as numeric value (0, 1, 2...) or fractional indexing for efficient reordering
- Batch update: single API call with array of `{noteId, newPosition}` for all affected notes
- Visual grab handle (⋮⋮ icon) provides better affordance than dragging anywhere
- Optimistic UI: Update immediately, rollback only on error
- Accessibility: provide keyboard alternative (Ctrl+Up/Down arrows to reorder selected note)
