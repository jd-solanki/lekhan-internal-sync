# DELETE /api/notes/:id — Test Scenarios

## Happy Path

- [ ] Delete existing note owned by user → 204 No Content
- [ ] Response body is empty
- [ ] Deleted note no longer appears in GET /api/notes
- [ ] GET /api/notes/:id after deletion → 404 Not Found

## Authentication

- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid token format → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Valid token → 204 No Content

## Authorization

- [ ] User A deletes User A's note → 204 No Content
- [ ] User A deletes User B's note → 404 Not Found
- [ ] Delete non-existent note ID → 404 Not Found
- [ ] Same 404 response for "doesn't exist" vs "not owned"

## Validation

- [ ] ID = valid integer → 204 or 404
- [ ] ID = 0 → 400 Bad Request
- [ ] ID = negative (-5) → 400 Bad Request
- [ ] ID = non-integer ("abc") → 400 Bad Request
- [ ] ID = very large integer (999999999) → 404 Not Found

## Idempotency

- [ ] Delete note once → 204 No Content
- [ ] Delete same note again → 404 Not Found (already deleted)
- [ ] Delete same note 3 times → 204, then 404, then 404

## Edge Cases

- [ ] Delete immediately after creating note → 204 No Content
- [ ] Delete note, then GET /api/notes/:id → 404
- [ ] Delete note, then PATCH /api/notes/:id → 404
- [ ] Delete note, then DELETE again → 404
- [ ] Delete note with large content (100KB) → 204 No Content

## Cache Invalidation

- [ ] Delete note, then GET /api/notes → note removed from list
- [ ] Delete note, then GET /api/notes/:id → 404 (cache invalidated)
- [ ] List cache invalidated after deletion

## Plan Limit Unlocking

- [ ] User at Starter limit (50/50), delete note → 204
- [ ] After deletion, POST new note → 201 Created (unlocked)
- [ ] User at Pro limit (200/200), delete note → unlocks creation
- [ ] User on Max plan (unlimited), delete note → no impact on limit

## Concurrent Operations

- [ ] Two simultaneous DELETEs for same note → first gets 204, second gets 404
- [ ] Delete while another user fetches (GET) → delete succeeds, fetch may return 404 or 200 (race)
- [ ] Delete note A while another user deletes note B → both succeed independently

## Performance

- [ ] Response time < 150ms at p95
- [ ] 100 delete requests in 60 seconds → all succeed
- [ ] 101st delete in 60 seconds → 429 Too Many Requests

## Side Effects

- [ ] Note count decreases by 1 after deletion
- [ ] Note removed from database permanently
- [ ] No soft delete flag set (hard delete)
- [ ] No trash/archive created

## Security

- [ ] Cannot delete note by guessing IDs → 404 for all non-owned notes
- [ ] Error message doesn't reveal whether note exists → always "Note not found"
- [ ] Attempting to recover deleted note → impossible (permanent deletion)

## Integration

- [ ] Deleting note at limit unlocks POST /api/notes immediately
- [ ] Frontend reloads list after DELETE → deleted note absent
- [ ] No undo functionality (permanent deletion per product rules)
