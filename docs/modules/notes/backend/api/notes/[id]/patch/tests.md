# PATCH /api/notes/:id — Test Scenarios

## Happy Path

- [ ] Update title only → 200 OK with updated title, content/position/createdAt unchanged
- [ ] Update content only → 200 OK with updated content, title/position/createdAt unchanged
- [ ] Update both title and content → 200 OK with both updated
- [ ] updatedAt changes to current timestamp
- [ ] Response includes all fields (id, userId, title, content, position, timestamps)

## Authentication

- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid token format → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Valid token → 200 OK

## Authorization

- [ ] User A updates User A's note → 200 OK
- [ ] User A updates User B's note → 404 Not Found
- [ ] Update non-existent note ID → 404 Not Found
- [ ] Same 404 response for "doesn't exist" vs "not owned"

## Validation - Title

- [ ] Title with 1 char → 200 OK
- [ ] Title with 255 chars → 200 OK
- [ ] Title with 256 chars → 422 Unprocessable Entity
- [ ] Title = empty string "" → 422 Unprocessable Entity
- [ ] Title = whitespace only "   " → 422 Unprocessable Entity (trimmed)
- [ ] Title = "Untitled" → 200 OK
- [ ] Title with Unicode emoji → 200 OK

## Validation - Content

- [ ] Content = empty string "" → 200 OK
- [ ] Content = 100KB (102400 bytes) → 200 OK
- [ ] Content = 100KB + 1 byte → 422 Unprocessable Entity
- [ ] Content = 90KB → 200 OK (warning shown client-side, not server)
- [ ] Content with Unicode → 200 OK
- [ ] Content with newlines and markdown → 200 OK

## Validation - Request Body

- [ ] Empty body {} → 422 Unprocessable Entity "Must provide title or content"
- [ ] Body with only title → 200 OK
- [ ] Body with only content → 200 OK
- [ ] Body with both title and content → 200 OK
- [ ] Malformed JSON → 400 Bad Request
- [ ] Body with extra fields (ignored) → 200 OK

## Validation - ID Parameter

- [ ] ID = valid integer → 200 OK or 404
- [ ] ID = 0 → 400 Bad Request
- [ ] ID = negative → 400 Bad Request
- [ ] ID = non-integer "abc" → 400 Bad Request

## Edge Cases

- [ ] Update title to exact same value → 200 OK, updatedAt changes
- [ ] Update content to exact same value → 200 OK, updatedAt changes
- [ ] Update immediately after creation → 200 OK
- [ ] Update immediately after previous update → 200 OK
- [ ] Update with very long title (255 chars) → 200 OK
- [ ] Update with markdown special chars → 200 OK, markdown preserved

## Idempotency

- [ ] Same PATCH request sent twice → both return 200 with same final state
- [ ] Update title to "A", then to "A" again → both succeed, same result

## Concurrent Operations

- [ ] Two simultaneous updates to same note → last write wins
- [ ] Update note A while another user updates note B → both succeed independently
- [ ] Update while another user fetches (GET) → eventual consistency, may return old or new

## Cache Invalidation

- [ ] Update note, then GET /api/notes → list cache invalidated, shows updated title
- [ ] Update note, then GET /api/notes/:id → note cache invalidated, returns updated content
- [ ] Update note twice → cache invalidated both times

## Performance

- [ ] Response time < 300ms at p95
- [ ] 100 update requests in 60 seconds → all succeed
- [ ] 101st update in 60 seconds → 429 Too Many Requests
- [ ] Update with 100KB content < 500ms

## Side Effects

- [ ] position field unchanged after PATCH
- [ ] createdAt field unchanged after PATCH
- [ ] Only provided fields updated (partial update)
- [ ] userId field unchanged

## Auto-Save Scenarios

- [ ] User types, waits 3s → auto-save triggered → 200 OK
- [ ] Rapid typing (updates every 100ms) → debounced to 3s intervals client-side
- [ ] Update title separately from content → both trigger auto-save independently
