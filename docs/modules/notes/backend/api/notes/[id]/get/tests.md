# GET /api/notes/:id — Test Scenarios

## Happy Path

- [ ] Fetch existing note owned by user → 200 OK with full content
- [ ] Response includes id, userId, title, content, position, createdAt, updatedAt
- [ ] Response includes ETag header
- [ ] Fetch note with empty content → 200 with content: ""
- [ ] Fetch note with 100KB content → 200 with full content
- [ ] Fetch note with Unicode title and content → 200 with Unicode preserved

## Authentication

- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid token format → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Valid token → 200 OK

## Authorization

- [ ] User A fetches User A's note → 200 OK
- [ ] User A fetches User B's note → 404 Not Found (don't leak existence)
- [ ] User fetches non-existent note ID → 404 Not Found
- [ ] Same 404 response for "doesn't exist" vs "not owned"

## Validation

- [ ] ID = valid integer (42) → 200 OK or 404
- [ ] ID = 0 → 400 Bad Request
- [ ] ID = negative (-5) → 400 Bad Request
- [ ] ID = non-integer ("abc") → 400 Bad Request
- [ ] ID = float (3.14) → 400 Bad Request
- [ ] ID = very large integer (999999999) → 404 Not Found

## Response Structure

- [ ] Response is single object (not array)
- [ ] id matches requested ID
- [ ] userId matches authenticated user
- [ ] title is string (can be empty)
- [ ] content is string (can be empty)
- [ ] position is integer
- [ ] createdAt and updatedAt are ISO8601 strings

## Edge Cases

- [ ] Fetch note immediately after creation → 200 with fresh data
- [ ] Fetch note immediately after PATCH → 200 with updated content
- [ ] Fetch note immediately after DELETE → 404 Not Found
- [ ] Fetch note with 255-char title → 200 with full title
- [ ] Fetch note with markdown special chars → 200 with content preserved
- [ ] Fetch note with newlines in content → 200 with newlines preserved

## Caching

- [ ] First request → 200 OK, cache MISS
- [ ] Second request within 5 min → 200 OK, cache HIT (same data)
- [ ] Update note via PATCH, then fetch → cache invalidated, updated data returned
- [ ] Delete note via DELETE, then fetch → 404 Not Found
- [ ] ETag value matches updatedAt timestamp

## Performance

- [ ] Response time < 150ms at p95
- [ ] Fetch note with 100KB content < 300ms
- [ ] 100 fetch requests in 60 seconds → all succeed
- [ ] 101st request in 60 seconds → 429 Too Many Requests

## Concurrent Operations

- [ ] Fetch while another user fetches same note → both fail with 404 (different users)
- [ ] Fetch while note is being updated via PATCH → returns either old or new data (eventual consistency)
- [ ] Two simultaneous fetch requests for same note → both return same data

## Security

- [ ] Cannot fetch note by guessing IDs → 404 for all non-owned notes
- [ ] Error message doesn't reveal whether note exists → always "Note not found"
- [ ] userId in response matches authenticated user
