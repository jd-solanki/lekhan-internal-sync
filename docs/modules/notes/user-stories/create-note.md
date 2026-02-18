# Create a New Note

## Story
**As a** authenticated user  
**I want** to create a new blank note with visual editor  
**So that** I can start capturing ideas immediately

**Module:** Notes

## Acceptance Criteria
- [ ] "New Note" button visible in notes interface when under plan limit
- [ ] Clicking button creates blank note instantly (<100ms perceived latency)
- [ ] New note appears at top of sidebar list
- [ ] Visual editor (Nuxt UI Editor) loads ready for typing
- [ ] Auto-save triggers 3 seconds after first keystroke
- [ ] Note persisted as markdown in database
- [ ] Creation blocked with upgrade prompt if user at plan limit

## How it Works
1. User clicks "New Note" button in sidebar
2. System checks subscription plan limit (Starter: 50, Pro: 200, Max: unlimited)
3. If under limit, blank note created with default title "Untitled" and empty markdown content
4. Note assigned unique ID and position at top of user's note list
5. Editor loads immediately, cursor positioned in content area
6. Auto-save activates after first keystroke (3s delay)

## Alternate Flows
- **At plan limit**: Creation blocked, modal shows "You've reached your [plan name] limit of [X] notes. Upgrade to create more." with upgrade CTA
- **Network failure during creation**: Show error toast, retry automatically once, fallback to "Unable to create note" message after retry fails

## Edge Cases
- User rapidly clicks "New Note" multiple times: Debounce clicks to prevent duplicate note creation
- Session expires during creation: Redirect to login, preserve note creation intent after re-auth
- User at exactly plan limit (50/50): Block creation, show upgrade prompt
- Empty note never edited: Still persists (no automatic deletion of unused notes)

## Notes
- Default title "Untitled" allows immediate typing without forced title entry
- Position value auto-calculated as max(position) + 1 for new notes
- Plan limit check happens server-side (don't trust client validation)
- userId from session automatically attached to note for ownership enforcement
