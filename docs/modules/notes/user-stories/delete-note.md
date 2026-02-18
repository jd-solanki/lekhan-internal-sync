# Delete a Note Permanently

## Story
**As a** authenticated user  
**I want** to permanently delete a note I no longer need  
**So that** I can keep my notes list clean and focused

**Module:** Notes

## Acceptance Criteria
- [ ] Delete button/icon visible on note (hover state or context menu)
- [ ] Confirmation modal appears before deletion
- [ ] Modal clearly states deletion is permanent (no recovery)
- [ ] Confirming deletion removes note immediately from UI
- [ ] Note deleted from database (hard delete, no soft delete)
- [ ] User redirected to notes list if viewing deleted note
- [ ] Canceling modal keeps note intact

## How it Works
1. User clicks delete icon on note (in sidebar or within note editor)
2. Confirmation modal appears: "Delete '[Note Title]'? This action is permanent and cannot be undone."
3. User clicks "Delete" button in modal
4. DELETE request sent to `/api/notes/:id`
5. Note removed from sidebar immediately (optimistic)
6. If viewing deleted note in editor, redirect to `/notes` (list view)
7. Success toast: "Note deleted"

## Alternate Flows
- **Cancel deletion**: User clicks "Cancel" or presses Escape — modal closes, note remains unchanged
- **Network failure during delete**: Show error toast "Failed to delete note" and restore note in UI (rollback optimistic delete)
- **Delete last remaining note**: Deletion succeeds, user sees empty state with "Create your first note" prompt

## Edge Cases
- User at plan limit, deletes note: Note count decreases, creation unlocked if now under limit
- Concurrent edit from another device: Last action wins — if note being edited elsewhere while deleted, other device shows "Note not found" on next save attempt
- Rapid double-click on delete: Debounce to prevent duplicate deletion attempts
- Session expires during deletion: Redirect to login, do NOT complete deletion (require re-auth for destructive action)
- Delete while note has unsaved changes: Deletion takes precedence (no save needed since content being destroyed)

## Notes
- No trash/archive feature per module README ("permanent deletion")
- Confirmation modal critical for preventing accidental data loss
- Modal buttons: "Cancel" (secondary) and "Delete" (danger/red primary)
- Delete icon: trash can icon, positioned in note context menu or as hover action
- Keyboard shortcut: Consider Cmd/Ctrl+Delete for quick deletion (still requires confirmation)
- After deletion, focus management: return focus to notes list first item or search bar
- Consider export/download feature separately if users need backups before deleting
