# Edit Note with Auto-Save

## Story
**As a** authenticated user  
**I want** to type in my note and see auto-save feedback every 3 seconds  
**So that** I never lose my work and feel confident my content is safe

**Module:** Notes

## Acceptance Criteria
- [ ] User can type in visual editor (Nuxt UI Editor) without manual save action
- [ ] Auto-save triggers 3 seconds after user stops typing
- [ ] Visual indicator shows "Saving..." during save operation
- [ ] Visual indicator shows "Saved" with timestamp after successful save
- [ ] Content persisted as markdown (no HTML in database)
- [ ] Typing resets 3-second timer (debounced)
- [ ] Editor remains responsive during auto-save (non-blocking)

## How it Works
1. User types in note editor
2. Debounced timer starts (3 seconds)
3. If user continues typing, timer resets
4. After 3 seconds of no typing, PATCH request sends markdown content to server
5. "Saving..." indicator appears during request
6. On success, indicator changes to "Saved at [time]"
7. Content persisted to database as markdown via Nuxt Content

## Alternate Flows
- **Network failure during save**: Show error toast "Save failed. Retrying..." and automatically retry with exponential backoff (3 attempts max)
- **Conflict (concurrent edits)**: Rare case if edited from multiple devices — last write wins, show warning toast "Note updated from another device"
- **Session expires during typing**: Queue save, redirect to login, restore note content after re-auth, complete save

## Edge Cases
- User types continuously for hours: Auto-save still triggers every 3s of pause, no data loss
- User navigates away before 3s timer completes: Trigger immediate save before navigation (beforeunload hook)
- Very large note content (>100KB markdown): Show warning at 90KB, block edits at 100KB with "Note too large" message
- Only whitespace changes: Still trigger save (whitespace is valid content)
- Title changes: Separate auto-save for title with same 3s debounce

## Notes
- Nuxt UI Editor provides visual interface but outputs valid markdown
- Database stores only markdown, never HTML (security and portability)
- Auto-save indicator positioned unobtrusively (top-right corner or bottom status bar)
- Timestamp format: "Saved at 3:45 PM" (12-hour format with AM/PM)
- Timer implementation: use Vue composable like `useDebounceFn` from VueUse
